import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Rally } from '../../models/rally.model';
import { Stage } from '../../models/stage.model';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { InsertService } from './insert-service';
import { GetdataService } from '../../shared/getdata.service';
import { NotificationService } from '../../shared/notification.service';
import { Stagetime } from '../../models/stagetime.model';
import { Rallycar } from '../../models/rallycar.model';
import { Rallymeterdifference } from '../../models/rallymeterdifference.model';

@Component({
  selector: 'app-insertStagetime',
  templateUrl: 'insert-stagetime.component.html',
})
export class InsertStagetimeComponent implements OnInit {
  myForm: FormGroup;
  rallys: Rally[] = [];
  stages: Stage[] = [];
  cars: Rallycar[] = [];
  Stagetimes: Stagetime[] = [];
  selrallys: SelectItem[] = [];
  selstages: SelectItem[] = [];
  selectedCars: any;
  rallyselected = '';
  stageselected = '';
  stagetimesRaw = '';
  tblStagetimes = [];

  constructor(
    private insertService: InsertService,
    private confirmationService: ConfirmationService,
    private getService: GetdataService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.getRallys();
  }

  getRallys() {
    this.getService.getRallys().subscribe((rallys: Rally[]) => {
      this.rallys = rallys;
      this.selrallys = [];
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
      for (const rally of this.rallys) {
        const tmpstartdate = new Date(rally.startdate).toLocaleDateString('en', options);
        const tmpenddate = new Date(rally.enddate).toLocaleDateString('en', options);
        this.selrallys.push({
          label: rally.name + ' (' + tmpstartdate + ' - ' + tmpenddate + ')',
          value: rally.rallyID,
        });
        this.rallyselected = rally.rallyID;
      }
      if (this.rallys.length > 0) {
        this.getStages();
      } else {
        const msg = {
          summary: 'No Rally created',
          detail: 'Please create at first a Rally',
          severity: 'error',
        };
        this.notificationService.handleError(msg);
      }
    });
  }

  getStages() {
    this.getService.getRallyStages(this.rallyselected).subscribe((stages: Stage[]) => {
      this.stages = stages;
      this.selstages = [];
      for (const stage of this.stages) {
        this.selstages.push({
          label: '#' + stage.stagenumber + ' ' + stage.name + ' - ' + stage.meter / 1000 + ' km',
          value: stage.StageID,
        });
        this.stageselected = stage.StageID;
      }
      this.getStagetimes();
      this.getCars();
    });
  }

  getCars() {
    this.getService.getRallyCar(this.rallyselected).subscribe((cars: Rallycar[]) => {
      this.cars = cars;
    });
  }

  generateObjs() {
    this.getService.getRallyCar(this.rallyselected).subscribe((cars: Rallycar[]) => {
      this.cars = cars;

      const stagetime = this.stagetimesRaw;
      const array = stagetime.split(/\r?\n/);
      const stagetimeobj: Stagetime[] = [];
      const rallymeterobj: Rallymeterdifference[] = [];
      const selectedStageObj = this.stages.filter((stage) => stage.StageID === this.stageselected)[0];
      for (let i = 0; i < array.length; i = i + 1) {
        const line = array[i].split('\t');
        // Array Position, Drivernumber, Country+Name, Time, Diff  Prev, Diff First
        const tmpCar = this.cars.filter((car) => car.startnumber === +line[1])[0];
        if (tmpCar) {
          // tslint:disable-next-line
          const position = +line[0].replace('.', '');
          const time = line[3];
          const tmpStagetime: Stagetime = new Stagetime(
            this.stageselected,
            this.rallyselected,
            tmpCar.carObj.carID,
            time,
            position,
            tmpCar.carObj.manufacturer,
            tmpCar.carObj.driver,
            tmpCar.carObj.codriver,
          );
          if (selectedStageObj.cancelled) {
            tmpStagetime.time = '0';
          }
          stagetimeobj.push(tmpStagetime);
          const meter = selectedStageObj.meter;
          const totalsecond = this.getotaltimeinSeconds(time);
          const meterpersecond = meter / totalsecond;
          const tmprallymeterobj: Rallymeterdifference = new Rallymeterdifference(
            position,
            meter,
            '' + totalsecond,
            '' + meterpersecond,
            tmpCar.carObj.driver,
            selectedStageObj.StageID,
            this.rallyselected,
            tmpCar.carID,
          );
          rallymeterobj.push(tmprallymeterobj);
        }
      }
      this.insertService.insertstagetime(stagetimeobj).subscribe(
        (data) => {
          this.notificationService.handleError(data.notification);
          this.insertService.insertmeterdifference(rallymeterobj).subscribe(
            (data) => {
              this.notificationService.handleError(data.notification);
              this.getStagetimes();
            },
            (error) => console.error(error),
          );
        },
        (error) => console.error(error),
      );
    });
  }

  getStagetimes() {
    this.getService.getStagetime(this.stageselected).subscribe((stages: Stagetime[]) => {
      this.Stagetimes = stages;
      this.tblStagetimes = [];
      for (const time of this.Stagetimes) {
        this.tblStagetimes.push({
          startnumber: time.car,
          driver: time.driverObj.firstname + ' ' + time.driverObj.lastname,
          codriver: time.codriverObj.firstname + ' ' + time.codriverObj.lastname,
          manufacturer: time.manufacturerObj.name,
          time: time.time,
          position: time.position,
        });
      }
    });
  }

  confirmDel(car: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete Car ' + car.startnumber + ' ?',
      accept: () => {
        const selectedStagetime = this.Stagetimes.filter((stagetime) => stagetime.car === car.startnumber)[0];
        this.deleteStagetime(selectedStagetime);
      },
    });
  }

  deleteStagetime(stagetime: Stagetime) {
    this.insertService.deleteStagetime(stagetime).subscribe(
      (data) => {
        this.notificationService.handleError(data.notification);
        this.getStagetimes();
      },
      (error) => console.error(error),
    );
  }

  getotaltimeinSeconds(time: string) {
    const splittime = time.split(':');
    let seconds = 0;
    let minutes = 0;
    if (splittime.length === 2) {
      seconds = +splittime[0] * 60;
      seconds = seconds + +splittime[1];
    } else if (splittime.length === 3) {
      minutes = +splittime[0] * 60 * 60;
      seconds = +splittime[1] * 60;
      seconds = minutes + seconds + +splittime[2];
    } else {
      seconds = +splittime;
    }
    return seconds;
  }
}
