import { Component, OnInit } from '@angular/core';
import { Rally } from '../../models/rally.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../shared/notification.service';
import { InsertService } from './insert-service';
import { Country } from '../../models/country.model';
import { SelectItem } from 'primeng/primeng';
import { GetdataService } from '../../shared/getdata.service';

@Component({
  selector: 'app-insertRally',
  templateUrl: 'insert-rally.component.html',
})
export class InsertRallyComponent implements OnInit {
  myForm: FormGroup;
  rallys: Rally[] = [];
  countrys: Country[] = [];
  selcountrys: SelectItem[] = [];

  constructor(private insertService: InsertService, private getService: GetdataService, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
      startdate: new FormControl(null, Validators.required),
      enddate: new FormControl(null, Validators.required),
    });
    this.getCountrys();
    this.getRallys();
  }

  getCountrys() {
    this.getService.getCountrys()
      .subscribe(
        (countrys: Country[]) => {
          this.countrys = countrys;
          for (const country of this.countrys) {
            this.selcountrys.push({ label: country.name + ' (' + country.shortname + ')', value: country.countryID });
          }
        },
      );
  }

  getRallys() {
    this.getService.getRallys()
      .subscribe(
        (rallys: Rally[]) => {
          this.rallys = rallys;
          console.log(rallys);
        },
      );
  }

  onSubmit() {
    const rally = new Rally(
      this.myForm.value.name,
      this.myForm.value.country,
      this.myForm.value.startdate,
      this.myForm.value.enddate,
    );
    this.insertService.insertrally(rally)
      .subscribe(
        (data) => {
          this.notificationService.handleError(data.notification);
          this.getCountrys();
          this.myForm.reset();
        },
        error => console.error(error),
      );
  }

  getFlagCode(countryid: string) {
    for (const country of this.countrys) {
      if (country.countryID === countryid) {
        return country.shortname.toLowerCase();
      }
    }
  }
}

