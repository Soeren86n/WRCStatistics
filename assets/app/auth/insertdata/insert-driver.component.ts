import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from '../../models/country.model';
import { SelectItem } from 'primeng/primeng';
import { InsertService } from './insert-service';
import { GetdataService } from '../../shared/getdata.service';
import { NotificationService } from '../../shared/notification.service';
import { Driver } from '../../models/driver.model';

@Component({
  selector: 'app-insertDriver',
  templateUrl: 'insert-driver.component.html',
})

export class InsertDriverComponent implements OnInit {
  myForm: FormGroup;
  countrys: Country[] = [];
  drivers: Driver[] = [];
  selcountrys: SelectItem[] = [];
  DrivertoEdit: Driver = new Driver('', '', '', '');

  constructor(private insertService: InsertService,
              private getService: GetdataService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      firstname: new FormControl(null, Validators.required),
      lastname: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
    });
    this.getCountrys();
  }

  getCountrys() {
    this.getService.getCountrys()
      .subscribe(
        (countrys: Country[]) => {
          this.countrys = countrys;
          this.selcountrys = [];
          for (const country of this.countrys) {
            this.selcountrys.push({ label: country.name + ' (' + country.shortname + ')', value: country.countryID });
          }
          this.myForm.controls['country'].setValue(this.selcountrys[0].value);
          if (this.countrys.length < 1) {
            const msg = {
              summary: 'No Country created',
              detail: 'Please create at first a Country',
              severity: 'error',
            };
            this.notificationService.handleError(msg);
          } else {
            this.getDriver();
          }
        },
      );
  }

  getDriver() {
    this.getService.getDriver()
      .subscribe(
        (driver: Driver[]) => {
          this.drivers = driver;
        },
      );
  }

  onSubmit() {
    if (this.DrivertoEdit.driverID === '') {
      const driver = new Driver(
        this.myForm.value.firstname,
        this.myForm.value.lastname,
        this.myForm.value.country,
      );
      this.insertService.insertdriver(driver)
        .subscribe(
          (data) => {
            this.notificationService.handleError(data.notification);
            this.getCountrys();
            this.myForm.reset();
          },
          error => console.error(error),
        );
    } else {
      this.DrivertoEdit.firstname = this.myForm.value.firstname;
      this.DrivertoEdit.lastname = this.myForm.value.lastname;
      this.DrivertoEdit.country = this.myForm.value.country;
      this.insertService.updatedriver(this.DrivertoEdit).subscribe(
        (data) => {
          this.notificationService.handleError(data.notification);
          this.getCountrys();
          this.myForm.reset();
          this.DrivertoEdit = new Driver('', '', '', '');
        },
        error => console.error(error),
      );
    }
  }

  editDriver(driver: Driver) {
    this.myForm.reset();
    this.DrivertoEdit = driver;
    this.myForm.setValue({
      firstname: driver.firstname,
      lastname: driver.lastname,
      country: driver.countryObj.countryID,
    });
  }

  getFlagCode(countryid: string) {
    for (const country of this.countrys) {
      if (country.countryID === countryid) {
        return country.shortname.toLowerCase();
      }
    }
  }

  resetWholeForm() {
    this.myForm.reset();
    this.DrivertoEdit = new Driver('', '', '', '');
  }

}
