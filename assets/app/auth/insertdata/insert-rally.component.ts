import { Component, OnInit } from '@angular/core';
import { Rally } from '../../models/rally.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../shared/notification.service';
import { InsertService } from './insert-service';
import { Country } from '../../models/country.model';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
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
  RallytoEdit: Rally = new Rally('', '', '', '', '');

  constructor(
    private confirmationService: ConfirmationService,
    private insertService: InsertService,
    private getService: GetdataService,
    private notificationService: NotificationService,
  ) {}

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
    this.getService.getCountrys().subscribe((countrys: Country[]) => {
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
      }
    });
  }

  getRallys() {
    this.getService.getRallys().subscribe((rallys: Rally[]) => {
      this.rallys = rallys;
    });
  }

  editRally(rally: Rally) {
    this.myForm.reset();
    this.RallytoEdit = rally;
    this.myForm.setValue({
      name: rally.name,
      startdate: rally.startdate,
      enddate: rally.enddate,
      country: rally.countryObj.countryID,
    });
  }

  confirmDel(rally: Rally) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete Rally ' + rally.name + ' ?',
      accept: () => {
        this.deleteRally(rally);
      },
    });
  }

  deleteRally(rally: Rally) {
    this.insertService.deleteRally(rally).subscribe(
      (data) => {
        this.notificationService.handleError(data.notification);
        this.getCountrys();
        this.getRallys();
      },
      (error) => console.error(error),
    );
  }

  onSubmit() {
    if (this.RallytoEdit.rallyID === '') {
      const rally = new Rally(this.myForm.value.name, this.myForm.value.country, this.myForm.value.startdate, this.myForm.value.enddate);
      this.insertService.insertrally(rally).subscribe(
        (data) => {
          this.notificationService.handleError(data.notification);
          this.getRallys();
          this.getCountrys();
          this.myForm.reset();
        },
        (error) => console.error(error),
      );
    } else {
      this.RallytoEdit.name = this.myForm.value.name;
      this.RallytoEdit.startdate = this.myForm.value.startdate;
      this.RallytoEdit.enddate = this.myForm.value.enddate;
      this.RallytoEdit.country = this.myForm.value.country;
      this.insertService.updaterally(this.RallytoEdit).subscribe(
        (data) => {
          this.notificationService.handleError(data.notification);
          this.getCountrys();
          this.getRallys();
          this.myForm.reset();
          this.RallytoEdit = new Rally('', '', '', '');
        },
        (error) => console.error(error),
      );
    }
  }

  getFlagCode(countryid: string) {
    // for (const country of this.countrys) {
    //   if (country.countryID === countryid) {
    //     return country.shortname.toLowerCase();
    //   }
    // }
    const tmpCountry = this.countrys.filter((country) => country.countryID === countryid)[0];
    return tmpCountry.shortname.toLowerCase();
  }

  resetWholeForm() {
    this.myForm.reset();
    this.RallytoEdit = new Rally('', '', '', '');
  }
}
