import { Component, OnInit } from '@angular/core';
import { InsertService } from './insert-service';
import { Country } from '../../models/country.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../shared/notification.service';
import { AllCountrys, CountryCode } from '../../models/countrycode.model';

@Component({
  selector: 'app-insertCountry',
  templateUrl: 'insert-country.component.html',
})
export class InsertCountryComponent implements OnInit {
  myForm: FormGroup;

  constructor(private insertService: InsertService, private notificationService: NotificationService) {
  }

  onSubmit() {
    const country = new Country(
      this.myForm.value.name,
      this.myForm.value.shortname,
    );
    this.insertService.insertcountry(country)
      .subscribe(
        data => this.notificationService.handleError(data.notification),
        error => console.error(error),
      );
    this.myForm.reset();
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      shortname: new FormControl(
        null,
        [Validators.required, Validators.minLength(2), Validators.maxLength(2), this.countryValidator],
      ),
    });
  }


  countryValidator(control: FormControl): { [s: string]: boolean } {
    let inArray = false;
    for (const item of AllCountrys) {
      if (control.value === item.Code.toLowerCase()) {
        inArray = true;
      }
    }
    console.log(inArray);
    if (inArray) {
      return null;
    } else {
      return { noMatch: true };
    }
  }

}

