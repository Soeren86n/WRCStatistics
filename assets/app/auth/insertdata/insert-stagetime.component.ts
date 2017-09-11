import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Rally } from '../../models/rally.model';
import { Stage } from '../../models/stage.model';
import { SelectItem } from 'primeng/primeng';
import { InsertService } from './insert-service';
import { GetdataService } from '../../shared/getdata.service';
import { NotificationService } from '../../shared/notification.service';
import { Stagetime } from '../../models/stagetime.model';
import { Rallycar } from '../../models/rallycar.model';

@Component({
  selector: 'app-insertStagetime',
  templateUrl: 'insert-stagetime.component.html',
})

export class InsertStagetimeComponent implements OnInit {
  myForm: FormGroup;
  rallys: Rally[] = [];
  stages: Stage[] = [];
  cars: Rallycar[] = [];
  selrallys: SelectItem[] = [];
  selstages: SelectItem[] = [];
  rallyselected = '';
  stageselected = '';
  stagetimesRaw = '';

  constructor(private insertService: InsertService,
              private getService: GetdataService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.getRallys();
  }

  getRallys() {
    this.getService.getRallys()
      .subscribe(
        (rallys: Rally[]) => {
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
        },
      );
  }

  getStages() {
    this.getService.getRallyStages(this.rallyselected)
      .subscribe(
        (stages: Stage[]) => {
          this.stages = stages;
          this.selstages = [];
          for (const stage of this.stages) {
            this.selstages.push({
              label: '#' + stage.stagenumber + ' ' + stage.name + ' - ' + stage.meter / 1000 + ' km',
              value: stage.StageID,
            });
            this.stageselected = stage.StageID;
          }
          this.getCars();
        },
      );
  }

  getCars() {
    this.getService.getRallyCar(this.rallyselected)
      .subscribe(
        (cars: Rallycar[]) => {
          this.cars = cars;
        },
      );
  }

  generateObjs() {
    this.getService.getRallyCar(this.rallyselected)
      .subscribe(
        (cars: Rallycar[]) => {
          this.cars = cars;

          const stagetime = this.stagetimesRaw;
          const array = stagetime.split(/\r?\n/);
          const stagetimeobj: Stagetime[] = [];
          for (let i = 0; i < array.length; i = i + 1) {
            const line = array[i].split('\t');
            // Array Position, Drivernumber, Country+Name, Time, Diff  Prev, Diff First
            const tmpCar = this.cars.filter(car => car.startnumber === +line[1])[0];
            if (tmpCar) {
              const tmpStagetime: Stagetime = new Stagetime(
                this.stageselected,
                this.rallyselected,
                tmpCar.carObj.carID,
                line[3],
                line[0],
                tmpCar.carObj.manufacturer,
                tmpCar.carObj.driver,
                tmpCar.carObj.codriver,
              );
              stagetimeobj.push(tmpStagetime);
            }
          }
          console.log(stagetimeobj);
          this.insertService.insertstagetime(stagetimeobj)
            .subscribe(
              (data) => {
                this.notificationService.handleError(data.notification);
              },
              error => console.error(error),
            );
        },
      );
  }


}
