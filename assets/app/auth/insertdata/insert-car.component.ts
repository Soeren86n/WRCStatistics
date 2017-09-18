import { Component, OnInit } from '@angular/core';
import { InsertService } from './insert-service';
import { GetdataService } from '../../shared/getdata.service';
import { NotificationService } from '../../shared/notification.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Manufacturer } from '../../models/manufacturer.model';
import { Codriver } from '../../models/codriver.model';
import { Driver } from '../../models/driver.model';
import { SelectItem } from 'primeng/primeng';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-insertCar',
  templateUrl: 'insert-car.component.html',
})

export class InsertCarComponent implements OnInit {
  myForm: FormGroup;
  drivers: Driver[] = [];
  codrivers: Codriver[] = [];
  manufacturers: Manufacturer[] = [];
  cars: Car[] = [];
  CartoEdit: Car = new Car(0, 0, '', '', '', '');
  seldriver: SelectItem[] = [];
  selcodriver: SelectItem[] = [];
  selmanufacturer: SelectItem[] = [];


  constructor(private insertService: InsertService,
              private getService: GetdataService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    const today = new Date();
    const year = today.getFullYear();
    this.myForm = new FormGroup({
      startnumber: new FormControl(null, Validators.required),
      year: new FormControl(year, Validators.required),
      driver: new FormControl(null, Validators.required),
      codriver: new FormControl(null, Validators.required),
      manufacturer: new FormControl(null, Validators.required),
    });
    this.getDriver();
  }

  getDriver() {
    this.getService.getDriver()
      .subscribe(
        (driver: Driver[]) => {
          this.drivers = driver;
          this.seldriver = [];
          for (const driver of this.drivers) {
            this.seldriver.push({ label: driver.firstname + ' ' + driver.lastname, value: driver.driverID });
          }
          this.myForm.controls['driver'].setValue(this.seldriver[0].value);
          if (this.drivers.length < 1) {
            const msg = {
              summary: 'No Driver created',
              detail: 'Please create at first a Driver',
              severity: 'error',
            };
            this.notificationService.handleError(msg);
          } else {
            this.getCodriver();
          }
        },
      );
  }

  getCodriver() {
    this.getService.getCodriver()
      .subscribe(
        (driver: Codriver[]) => {
          this.codrivers = driver;
          this.selcodriver = [];
          for (const driver of this.codrivers) {
            this.selcodriver.push({ label: driver.firstname + ' ' + driver.lastname, value: driver.codriverID });
          }
          this.myForm.controls['codriver'].setValue(this.selcodriver[0].value);
          if (this.codrivers.length < 1) {
            const msg = {
              summary: 'No Codriver created',
              detail: 'Please create at first a Codriver',
              severity: 'error',
            };
            this.notificationService.handleError(msg);
          } else {
            this.getManufacturer();
          }
        },
      );
  }

  getManufacturer() {
    this.getService.getManufacturer()
      .subscribe(
        (manu: Manufacturer[]) => {
          this.manufacturers = manu;
          this.selmanufacturer = [];
          for (const manufacturer of this.manufacturers) {
            this.selmanufacturer.push({ label: manufacturer.name, value: manufacturer.manufacturerID });
          }
          this.myForm.controls['manufacturer'].setValue(this.selmanufacturer[0].value);

          if (this.codrivers.length < 1) {
            const msg = {
              summary: 'No Manufacturer created',
              detail: 'Please create at first a Manufacturer',
              severity: 'error',
            };
            this.notificationService.handleError(msg);
          } else {
            this.getCars();
          }
        },
      );
  }

  getCars() {
    this.getService.getCar()
      .subscribe(
        (car: Car[]) => {
          this.cars = car;
        },
      );
  }

  onSubmit() {
    if (this.CartoEdit.carID === '') {
      const car = new Car(
        this.myForm.value.startnumber,
        this.myForm.value.year,
        this.myForm.value.driver,
        this.myForm.value.codriver,
        this.myForm.value.manufacturer,
      );
      this.insertService.insertcar(car)
        .subscribe(
          (data) => {
            this.notificationService.handleError(data.notification);
            this.getDriver();
            this.myForm.reset();
          },
          error => console.error(error),
        );
    } else {
      this.CartoEdit.startnumber = this.myForm.value.startnumber;
      this.CartoEdit.year = this.myForm.value.year;
      this.CartoEdit.driver = this.myForm.value.driver;
      this.CartoEdit.codriver = this.myForm.value.codriver;
      this.CartoEdit.manufacturer = this.myForm.value.manufacturer;
      this.insertService.updatecar(this.CartoEdit).subscribe(
        (data) => {
          this.notificationService.handleError(data.notification);
          this.getDriver();
          this.myForm.reset();
          this.CartoEdit = new Car(0, 0, '', '', '', '');
        },
        error => console.error(error),
      );
    }
  }

  editCar(car: Car) {
    this.myForm.reset();
    this.CartoEdit = car;
    this.myForm.setValue({
      startnumber: car.startnumber,
      year: car.year,
      driver: car.driverObj.driverID,
      codriver: car.codriverObj.codriverID,
      manufacturer: car.manufacturerObj.manufacturerID,
    });
  }


  getFlagCodebyDriver(driverid: string) {
    // for (const driver of this.drivers) {
    //   if (driver.driverID === driverid) {
    //     return driver.countryObj.shortname.toLowerCase();
    //   }
    // }
    const tmpDriver = this.drivers.filter(driver => driver.driverID === driverid)[0];
    return tmpDriver.countryObj.shortname.toLowerCase();
  }

  getFlagCodebyCodriver(driverid: string) {
    // for (const driver of this.codrivers) {
    //   if (driver.codriverID === driverid) {
    //     return driver.countryObj.shortname.toLowerCase();
    //   }
    // }
    const tmpDriver = this.codrivers.filter(driver => driver.codriverID === driverid)[0];
    return tmpDriver.countryObj.shortname.toLowerCase();
  }

  getFlagCodebyManufacturer(manuid: string) {
    // for (const manufacturer of this.manufacturers) {
    //   if (manufacturer.manufacturerID === manuid) {
    //     return manufacturer.countryObj.shortname.toLowerCase();
    //   }
    // }
    const tmpManu = this.manufacturers.filter(manu => manu.manufacturerID === manuid)[0];
    return tmpManu.countryObj.shortname.toLowerCase();
  }

  allDataComplete() {
    return (this.drivers.length > 0 && this.codrivers.length > 0 && this.manufacturers.length > 0);
  }
}
