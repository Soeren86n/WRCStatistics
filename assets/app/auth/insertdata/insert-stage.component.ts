import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../shared/notification.service';
import { GetdataService } from '../../shared/getdata.service';
import { InsertService } from './insert-service';
import { Rally } from '../../models/rally.model';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
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
  StagetoEdit: Stage = new Stage('', 0, '', false, false, 0, 0, '', '');

  constructor(
    private confirmationService: ConfirmationService,
    private insertService: InsertService,
    private getService: GetdataService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.myForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      day: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      cancelled: new FormControl('0', Validators.required),
      powerstage: new FormControl('0', Validators.required),
      stagenumber: new FormControl(null, Validators.required),
      meter: new FormControl(null, Validators.required),
    });
    this.getRallys();
  }

  getRallys() {
    this.getService.getRallys().subscribe((rallys: Rally[]) => {
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
        this.getStages();
      } else {
        const msg = {
          summary: 'No Rally created',
          detail: 'Please create at first a Rally',
          severity: 'error',
        };
        this.notificationService.handleError(msg);
      }
    });
  }

  getStages() {
    this.getService.getRallyStages(this.rallyselected).subscribe((stages: Stage[]) => {
      this.stages = stages;
    });
  }

  editStage(stage: Stage) {
    this.myForm.reset();
    this.StagetoEdit = stage;
    this.rallyselected = stage.RallyObj.rallyID;
    this.myForm.setValue({
      name: stage.name,
      day: stage.day,
      date: stage.date,
      cancelled: stage.cancelled ? '1' : '0',
      powerstage: stage.powerstage ? '1' : '0',
      stagenumber: stage.stagenumber,
      meter: stage.meter,
    });
  }

  confirmDel(stage: Stage) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete Stage ' + stage.name + ' ?',
      accept: () => {
        this.deleteStage(stage);
      },
    });
  }

  deleteStage(stage: Stage) {
    this.insertService.deleteStage(stage).subscribe(
      (data) => {
        this.notificationService.handleError(data.notification);
        this.getRallys();
      },
      (error) => console.error(error),
    );
  }

  onSubmit() {
    if (this.StagetoEdit.StageID === '') {
      const stage = new Stage(
        this.myForm.value.name,
        this.myForm.value.day,
        this.myForm.value.date,
        this.myForm.value.cancelled,
        this.myForm.value.powerstage,
        this.myForm.value.stagenumber,
        this.myForm.value.meter,
        this.rallyselected,
      );
      this.insertService.insertstage(stage).subscribe(
        (data) => {
          this.notificationService.handleError(data.notification);
          this.getRallys();
          this.myForm.reset();
          this.myForm.controls['cancelled'].setValue('0');
          this.myForm.controls['powerstage'].setValue('0');
        },
        (error) => console.error(error),
      );
    } else {
      this.StagetoEdit.name = this.myForm.value.name;
      this.StagetoEdit.day = this.myForm.value.day;
      this.StagetoEdit.date = this.myForm.value.date;
      this.StagetoEdit.cancelled = this.myForm.value.cancelled;
      this.StagetoEdit.powerstage = this.myForm.value.powerstage;
      this.StagetoEdit.stagenumber = this.myForm.value.stagenumber;
      this.StagetoEdit.meter = this.myForm.value.meter;
      this.StagetoEdit.rally = this.rallyselected;
      this.insertService.updatestage(this.StagetoEdit).subscribe(
        (data) => {
          this.notificationService.handleError(data.notification);
          this.getRallys();
          this.myForm.reset();
          this.myForm.controls['cancelled'].setValue('0');
          this.myForm.controls['powerstage'].setValue('0');
          this.StagetoEdit = new Stage('', 0, '', false, false, 0, 0, '', '');
        },
        (error) => console.error(error),
      );
    }
  }

  getFlagCode(rallyid: string) {
    const tmpRally = this.rallys.filter((rally) => rally.rallyID === rallyid)[0];
    return tmpRally.countryObj.shortname.toLowerCase();
  }
}
