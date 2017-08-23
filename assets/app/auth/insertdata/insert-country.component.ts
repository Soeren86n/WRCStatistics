import { Component } from '@angular/core';
import { InsertService } from './insert-service';
import { Country } from '../../models/country.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-insertCountry',
  templateUrl: 'insert-country.component.html',
})
export class InsertCountryComponent {
  myForm: FormGroup;

  constructor(private insertService: InsertService, private notificationService: NotificationService) {
  }

  onSubmit() {
    const user = new Country(
      this.myForm.value.name,
      this.myForm.value.shortname,
    );
    this.insertService.insertCountry(user)
      .subscribe(
        data => this.notificationService.handleError(data.notification),
        error => console.error(error),
      );
    this.myForm.reset();
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      shortname: new FormControl(null, Validators.required),
    });
  }
}

