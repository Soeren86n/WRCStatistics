import { Component, OnInit } from '@angular/core';
import { InsertService } from './insert-service';
import { Country } from '../../models/country.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../shared/notification.service';
import { AllCountrys } from '../../models/countrycode.model';
import { GetdataService } from '../../shared/getdata.service';

@Component({
  selector: 'app-insertCountry',
  templateUrl: 'insert-country.component.html',
})
export class InsertCountryComponent implements OnInit {
  myForm: FormGroup;
  countrys: Country[] = [];
  CountrytoEdit: Country = new Country('', '', '');

  constructor(private insertService: InsertService, private notificationService: NotificationService, private getService: GetdataService) {
  }

  onSubmit() {
    if (this.CountrytoEdit.countryID === '') {
      const country = new Country(
        this.myForm.value.name,
        this.myForm.value.shortname,
      );
      this.insertService.insertcountry(country)
        .subscribe(
          (data) => {
            this.notificationService.handleError(data.notification);
            this.getCountrys();
            this.myForm.reset();
          },
          error => console.error(error),
        );
    } else {
      this.CountrytoEdit.name = this.myForm.value.name;
      this.CountrytoEdit.shortname = this.myForm.value.shortname;
      this.insertService.updatecountry(this.CountrytoEdit).subscribe(
        (data) => {
          this.notificationService.handleError(data.notification);
          this.getCountrys();
          this.myForm.reset();
          this.CountrytoEdit = new Country('', '', '');
        },
        error => console.error(error),
      );
    }
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      shortname: new FormControl(
        null,
        [Validators.required, Validators.minLength(2), Validators.maxLength(2), this.countryValidator],
      ),
    });
    this.getCountrys();
  }

  getCountrys() {
    this.getService.getCountrys()
      .subscribe(
        (countrys: Country[]) => {
          this.countrys = countrys;
        },
      );
  }

  editCountry(country: Country) {
    this.myForm.reset();
    this.CountrytoEdit = country;
    this.myForm.setValue({
      name: country.name,
      shortname: country.shortname,
    });
  }


  countryValidator(control: FormControl): { [s: string]: boolean } {
    let inArray = false;
    for (const item of AllCountrys) {
      if (control.value === item.Code.toLowerCase()) {
        inArray = true;
      }
    }
    if (inArray) {
      return null;
    } else {
      return { noMatch: true };
    }
  }

}

