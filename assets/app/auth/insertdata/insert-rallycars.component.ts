import { Component, OnInit } from '@angular/core';
import { Rally } from '../../models/rally.model';
import { Car } from '../../models/car.model';
import { SelectItem } from 'primeng/primeng';
import { InsertService } from './insert-service';
import { GetdataService } from '../../shared/getdata.service';
import { NotificationService } from '../../shared/notification.service';
import { Rallycar } from '../../models/rallycar.model';

@Component({
  selector: 'app-insertRallycars',
  templateUrl: 'insert-rallycars.component.html',
})

export class InsertRallycarsComponent implements OnInit {
  rallys: Rally[] = [];
  cars: Car[] = [];
  selrallys: SelectItem[] = [];
  selcars: SelectItem[] = [];
  rallyselected = '';
  selectedCars: string[] = [];
  RallyCars: Rallycar[] = [];

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
            this.getCars();
            this.getRallyCars();
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

  getCars() {
    const tmpRally = this.rallys.filter(rally => rally.rallyID === this.rallyselected)[0];
    const tmpstartdate = new Date(tmpRally.startdate);
    const tmpYear = tmpstartdate.getFullYear();
    this.getService.getCarYear(tmpYear)
      .subscribe(
        (cars: Car[]) => {
          this.cars = cars;
          this.selcars = [];
          for (const car of this.cars) {
            this.selcars.push({
              label: '#' + car.startnumber + ' ' + car.driver + ' / ' + car.codriver + ' -> ' + car.manufacturer + ' (' + car.year + ')',
              value: car.carID,
            });
          }
        },
      );
  }

  insertRallyCars() {
    for (const selCar of this.selectedCars) {
      const tmpCar = this.cars.filter(car => car.carID === selCar)[0];
      const tmpRallyCar = new Rallycar(
        tmpCar.startnumber,
        this.rallyselected,
        tmpCar.carID);
      this.RallyCars.push(tmpRallyCar);
    }

    this.insertService.insertrallycar(this.RallyCars)
      .subscribe(
        (data) => {
          this.notificationService.handleError(data.notification);
          this.selectedCars = [];
          this.RallyCars = [];
        },
        error => console.error(error),
      );
  }

  updateCars() {
    this.getCars();
    this.getRallyCars();
  }

  getRallyCars() {
    this.getService.getRallyCar(this.rallyselected)
      .subscribe(
        (cars: Rallycar[]) => {
          this.RallyCars = cars;
        },
      );
  }

}
