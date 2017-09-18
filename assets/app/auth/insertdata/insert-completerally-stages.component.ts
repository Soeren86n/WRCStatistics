import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Rally } from '../../models/rally.model';
import { Stage } from '../../models/stage.model';
import { SelectItem } from 'primeng/primeng';
import { InsertService } from './insert-service';
import { GetdataService } from '../../shared/getdata.service';
import { NotificationService } from '../../shared/notification.service';
import { Stagetime } from '../../models/stagetime.model';
import { Rallycar } from '../../models/rallycar.model';
import { Rallymeterdifference } from '../../models/rallymeterdifference.model';

@Component({
  selector: 'app-insert-completeRallyStages',
  templateUrl: 'insert-completerally-stages.component.html',
})

export class InsertCompleterallyStagesComponent implements OnInit {
  rallys: Rally[] = [];
  selrallys: SelectItem[] = [];
  rallyselected = '';
  stagesRaw = '';

  constructor(private insertService: InsertService,
              private getService: GetdataService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.getRallys();
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
          if (this.rallys.length < 1) {
            const msg = {
              summary: 'No Rally created',
              detail: 'Please create at first a Rally',
              severity: 'error',
            };
            this.notificationService.handleError(msg);
          }
        },
      );
  }


  generateObjs() {
    const stagesobj: Stage[] = [];
    const array = this.stagesRaw.split(/\r?\n/);
    let name: string;
    let day = 0;
    let date;
    let cancelled: boolean;
    let powerstage = false;
    let stagenumber: number;
    let meter: number;
    for (let i = 0; i < array.length; i = i + 1) {
      const line = array[i].split('\t');
      if (line.length === 1) {
        day = day + 1;
        const dateline = line[0].split(' - ');
        const datesplit = dateline[1].split('.');
        date = datesplit[2] + '-' + datesplit[1] + '-' + datesplit[0];
      } else {
        const begin = line[0][0] + line[0][1];
        if (begin === 'SS') {
          stagenumber = +line[0].substring(2);
          name = line[1];
          meter = +line[2] * 1000;
          cancelled = line[4] !== 'COMPLETED';
          powerstage = i === array.length - 1;
          const stage = new Stage(name, day, date, cancelled, powerstage, stagenumber, meter, this.rallyselected);
          stagesobj.push(stage);
        }
      }
    }
    this.insertService.insertcompleterallystage(stagesobj)
      .subscribe(
        (data) => {
          this.notificationService.handleError(data.notification);
        },
        error => console.error(error),
      );
  }


}
