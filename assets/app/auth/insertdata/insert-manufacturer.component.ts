import { Component, OnInit } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { Country } from '../../models/country.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InsertService } from './insert-service';
import { GetdataService } from '../../shared/getdata.service';
import { NotificationService } from '../../shared/notification.service';
import { Manufacturer } from '../../models/manufacturer.model';

@Component({
  selector: 'app-insertManufacturer',
  templateUrl: 'insert-manufacturer.component.html',
})

export class InsertManufacturerComponent implements OnInit {
  myForm: FormGroup;
  countrys: Country[] = [];
  manufacturers: Manufacturer[] = [];
  ManufacturertoEdit: Manufacturer = new Manufacturer('', '', '');
  selcountrys: SelectItem[] = [];

  constructor(private confirmationService: ConfirmationService,
              private insertService: InsertService,
              private getService: GetdataService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      name: new FormControl(null, Validators.required),
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
          if (this.countrys.length < 1) {
            const msg = {
              summary: 'No Country created',
              detail: 'Please create at first a Country',
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
        (manufacturer: Manufacturer[]) => {
          this.manufacturers = manufacturer;
        },
      );
  }

  onSubmit() {
    if (this.ManufacturertoEdit.manufacturerID === '') {
      const manufacturer = new Manufacturer(
        this.myForm.value.name,
        this.myForm.value.country,
      );
      this.insertService.insertmanufacturer(manufacturer)
        .subscribe(
          (data) => {
            this.notificationService.handleError(data.notification);
            this.getCountrys();
            this.myForm.reset();
          },
          error => console.error(error),
        );
    } else {
      this.ManufacturertoEdit.name = this.myForm.value.name;
      this.ManufacturertoEdit.country = this.myForm.value.country;
      this.insertService.updatemanufacturer(this.ManufacturertoEdit).subscribe(
        (data) => {
          this.notificationService.handleError(data.notification);
          this.myForm.reset();
          this.getCountrys();
          this.ManufacturertoEdit = new Manufacturer('', '', '');
        },
        error => console.error(error),
      );
    }
  }

  editManufacturer(manufacturer: Manufacturer) {
    this.myForm.reset();
    this.ManufacturertoEdit = manufacturer;
    this.myForm.setValue({
      name: manufacturer.name,
      country: manufacturer.countryObj.countryID,
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
    this.ManufacturertoEdit = new Manufacturer('', '', '');
    this.myForm.reset();
  }
}
