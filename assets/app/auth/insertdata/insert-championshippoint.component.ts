import { Component, OnInit } from '@angular/core';
import { Rally } from '../../models/rally.model';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { InsertService } from './insert-service';
import { GetdataService } from '../../shared/getdata.service';
import { NotificationService } from '../../shared/notification.service';
import { Rallycar } from '../../models/rallycar.model';
import { Championshippoint } from '../../models/championshippoint.model';

@Component({
  selector: 'app-insertChampionshippoint',
  templateUrl: 'insert-championshippoint.component.html',
})
export class InsertChampionshippointComponent implements OnInit {
  rallys: Rally[] = [];
  RallyCars: Rallycar[] = [];
  selrallys: SelectItem[] = [];
  selcars: SelectItem[] = [];
  rallyselected = '';
  selectedCar = '';
  isPowerstagepoints = false;
  points = 0;
  ChampionPoints: Championshippoint[] = [];
  tblPoints = [];

  constructor(
    private insertService: InsertService,
    private getService: GetdataService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.selcars.push({
      label: '#',
      value: 0,
    });
    this.getRallys();
  }

  changetopowerstage() {
    if (this.isPowerstagepoints && this.points > 5) {
      this.points = 5;
    }
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
        this.getRallyCars();
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

  getRallyCars() {
    this.getService.getRallyCar(this.rallyselected).subscribe((cars: Rallycar[]) => {
      this.RallyCars = cars;
      this.selcars = [];
      for (const car of this.RallyCars) {
        this.selcars.push({
          label:
            '#' +
            car.startnumber +
            ' ' +
            car.carObj.driverObj.lastname +
            ' / ' +
            car.carObj.codriverObj.lastname +
            ' -> ' +
            car.carObj.manufacturerObj.name,
          value: car.carID,
        });
      }
      this.selectedCar = this.selcars[0].value;
      this.getPoints();
    });
  }

  insertPoints() {
    const tmpCar = this.RallyCars.filter((car) => car.carID === this.selectedCar)[0];
    let type = 'rally';
    if (this.isPowerstagepoints) {
      type = 'power';
    }
    const tmpPoints = new Championshippoint(
      this.points,
      type,
      tmpCar.rallyObj.enddate,
      tmpCar.rallyObj.rallyID,
      tmpCar.carObj.driverObj.driverID,
      tmpCar.carObj.codriverObj.codriverID,
      tmpCar.carObj.manufacturerObj.manufacturerID,
    );
    this.insertService.insertpoints(tmpPoints).subscribe(
      (data) => {
        this.notificationService.handleError(data.notification);
        this.points = 0;
        this.isPowerstagepoints = false;
        this.getPoints();
      },
      (error) => console.error(error),
    );
  }

  getPoints() {
    const tmpRally = this.rallys.filter((rally) => rally.rallyID === this.rallyselected)[0];
    const tmpstartdate = new Date(tmpRally.startdate);
    const tmpYear = tmpstartdate.getFullYear();
    this.getService.getChampionshippoints(tmpYear).subscribe((chpoints: Championshippoint[]) => {
      this.ChampionPoints = chpoints;
      console.log(this.ChampionPoints);
      this.tblPoints = [];
      for (const point of this.ChampionPoints) {
        let lbl = 'badge badge-success';
        if (point.type === 'power') {
          lbl = 'badge badge-info';
        }
        this.tblPoints.push({
          driver: point.driverObj.firstname + ' ' + point.driverObj.lastname,
          manufacturer: point.manufacturerObj.name,
          point: point.points,
          rally: point.rallyObj.name,
          lblcolor: lbl,
          pointID: point.pointID,
        });
      }
    });
  }

  confirmDel(car: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete Car ' + car.startnumber + ' ?',
      accept: () => {
        const selectedPoints = this.ChampionPoints.filter((point) => point.pointID === car.pointID)[0];
        this.deletePoints(selectedPoints);
      },
    });
  }

  deletePoints(points: Championshippoint) {
    this.insertService.deletePoints(points).subscribe(
      (data) => {
        this.notificationService.handleError(data.notification);
        this.getPoints();
      },
      (error) => console.error(error),
    );
  }
}
