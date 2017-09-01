import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../shared/notification.service';
import { GetdataService } from '../../shared/getdata.service';
import { InsertService } from './insert-service';
import { Rally } from '../../models/rally.model';
import { SelectItem } from 'primeng/primeng';
import { Stage } from '../../models/stage.model';

@Component({
  selector: 'app-insertStage',
  templateUrl: 'insert-stage.component.html',
})
export class InsertStageComponent implements OnInit {
  myForm: FormGroup;
  rallys: Rally[] = [];
  stages: Stage[] = [];
  selrallys: SelectItem[] = [];
  rallyselected = '';
  StagetoEdit: Stage = new Stage('', 0, '', false, 0, 0, '', '');

  constructor(private insertService: InsertService, private getService: GetdataService, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      day: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      cancelled: new FormControl('0', Validators.required),
      stagenumber: new FormControl(null, Validators.required),
      meter: new FormControl(null, Validators.required),
    });
    this.getRallys();
    this.getStages();
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
        },
      );
  }

  getStages() {
    this.getService.getStages()
      .subscribe(
        (stages: Stage[]) => {
          this.stages = stages;
          console.log(this.stages);
        },
      );
  }

  onSubmit() {
    if (this.StagetoEdit.StageID === '') {
      const stage = new Stage(
        this.myForm.value.name,
        this.myForm.value.day,
        this.myForm.value.date,
        this.myForm.value.cancelled,
        this.myForm.value.stagenumber,
        this.myForm.value.meter,
        this.rallyselected,
      );
      this.insertService.insertstage(stage)
        .subscribe(
          (data) => {
            this.notificationService.handleError(data.notification);
            this.getRallys();
            this.getStages();
            this.myForm.reset();
            this.myForm.controls['cancelled'].setValue('0');
          },
          error => console.error(error),
        );
    } else {
      this.StagetoEdit.name = this.myForm.value.name;
      this.StagetoEdit.day = this.myForm.value.day;
      this.StagetoEdit.date = this.myForm.value.date;
      this.StagetoEdit.cancelled = this.myForm.value.cancelled;
      this.StagetoEdit.stagenumber = this.myForm.value.stagenumber;
      this.StagetoEdit.meter = this.myForm.value.meter;
      this.StagetoEdit.rally = this.rallyselected;
      this.insertService.updatestage(this.StagetoEdit).subscribe(
        (data) => {
          this.notificationService.handleError(data.notification);
          this.getRallys();
          this.getStages();
          this.myForm.reset();
          this.myForm.controls['cancelled'].setValue('0');
          this.StagetoEdit = new Stage('', 0, '', false, 0, 0, '', '');
        },
        error => console.error(error),
      );
    }
  }

  getFlagCode(rallyid: string) {
    for (const rally of this.rallys) {
      if (rally.rallyID === rallyid) {
        return rally.countryObj.shortname.toLowerCase();
      }
    }
  }

}
