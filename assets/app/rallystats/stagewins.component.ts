import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../shared/getdata.service';
import { Stagetime } from '../models/stagetime.model';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'app-stagewins',
  templateUrl: 'stagewins.component.html',
})

export class StagewinsComponent implements OnInit {
  driverdata: any;
  codriverdata: any;
  manufacturerdata: any;
  options: any;
  Stagetimes: Stagetime[] = [];
  selectedPie = 'all';
  pietype: SelectItem[];
  driver = [];
  codriver = [];
  manufacturer = [];
  psdriver = [];
  pscodriver = [];
  psmanufacturer = [];

  constructor(private getService: GetdataService) {
    this.driverdata = {
      labels: [],
      datasets: [],
    };
    this.codriverdata = {
      labels: [],
      datasets: [],
    };
    this.manufacturerdata = {
      labels: [],
      datasets: [],
    };
    this.pietype = [];
    this.pietype.push({ label: 'All Stages', value: 'all' });
    this.pietype.push({ label: 'Powerstages', value: 'power' });
  }

  ngOnInit() {
    this.getStagewins();
  }

  getStagewins() {
    this.getService.getStagewins()
      .subscribe(
        (stages: Stagetime[]) => {
          this.Stagetimes = stages;
          this.orderPieData();
        },
      );
  }

  orderPieData() {
    for (const time of this.Stagetimes) {
      if (!time.stageObj.cancelled) {
        if (!this.driver[time.carObj.driver]) {
          this.driver[time.carObj.driver] = 1;
        } else {
          this.driver[time.carObj.driver] = this.driver[time.carObj.driver] + 1;
        }
        if (!this.codriver[time.carObj.codriver]) {
          this.codriver[time.carObj.codriver] = 1;
        } else {
          this.codriver[time.carObj.codriver] = this.codriver[time.carObj.codriver] + 1;
        }
        if (!this.manufacturer[time.carObj.manufacturer]) {
          this.manufacturer[time.carObj.manufacturer] = 1;
        } else {
          this.manufacturer[time.carObj.manufacturer] = this.manufacturer[time.carObj.manufacturer] + 1;
        }
        if (time.stageObj.powerstage) {
          if (!this.psdriver[time.carObj.driver]) {
            this.psdriver[time.carObj.driver] = 1;
          } else {
            this.psdriver[time.carObj.driver] = this.psdriver[time.carObj.driver] + 1;
          }
          if (!this.pscodriver[time.carObj.codriver]) {
            this.pscodriver[time.carObj.codriver] = 1;
          } else {
            this.pscodriver[time.carObj.codriver] = this.pscodriver[time.carObj.codriver] + 1;
          }
          if (!this.psmanufacturer[time.carObj.manufacturer]) {
            this.psmanufacturer[time.carObj.manufacturer] = 1;
          } else {
            this.psmanufacturer[time.carObj.manufacturer] = this.psmanufacturer[time.carObj.manufacturer] + 1;
          }
        }
      }
    }
    this.setPieData();
  }

  setPieData() {
    const tmpdriverdata = {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
      }],
    };
    const tmpcodriverdata = {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
      }],
    };
    const tmpmanufacturerdata = {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
      }],
    };
    if (this.selectedPie === 'all') {
      for (const key in this.driver) {
        const tmptime = this.Stagetimes.filter(time => time.carObj.driver === key)[0];
        tmpdriverdata.labels.push(tmptime.driverObj.firstname + ' ' + tmptime.driverObj.lastname);
        tmpdriverdata.datasets[0].data.push(this.driver[key]);
        tmpdriverdata.datasets[0].backgroundColor.push(this.getRandomColor());
      }
      this.driverdata = tmpdriverdata;
      for (const key in this.codriver) {
        const tmptime = this.Stagetimes.filter(time => time.carObj.codriver === key)[0];
        tmpcodriverdata.labels.push(tmptime.codriverObj.firstname + ' ' + tmptime.codriverObj.lastname);
        tmpcodriverdata.datasets[0].data.push(this.codriver[key]);
        tmpcodriverdata.datasets[0].backgroundColor.push(this.getRandomColor());
      }
      this.codriverdata = tmpcodriverdata;
      for (const key in this.manufacturer) {
        const tmptime = this.Stagetimes.filter(time => time.carObj.manufacturer === key)[0];
        tmpmanufacturerdata.labels.push(tmptime.manufacturerObj.name);
        tmpmanufacturerdata.datasets[0].data.push(this.manufacturer[key]);
        tmpmanufacturerdata.datasets[0].backgroundColor.push(this.getRandomColor());
      }
      this.manufacturerdata = tmpmanufacturerdata;
    } else if (this.selectedPie === 'power') {
      for (const key in this.psdriver) {
        const tmptime = this.Stagetimes.filter(time => time.carObj.driver === key)[0];
        tmpdriverdata.labels.push(tmptime.driverObj.firstname + ' ' + tmptime.driverObj.lastname);
        tmpdriverdata.datasets[0].data.push(this.psdriver[key]);
        tmpdriverdata.datasets[0].backgroundColor.push(this.getRandomColor());
      }
      this.driverdata = tmpdriverdata;
      for (const key in this.pscodriver) {
        const tmptime = this.Stagetimes.filter(time => time.carObj.codriver === key)[0];
        tmpcodriverdata.labels.push(tmptime.codriverObj.firstname + ' ' + tmptime.codriverObj.lastname);
        tmpcodriverdata.datasets[0].data.push(this.pscodriver[key]);
        tmpcodriverdata.datasets[0].backgroundColor.push(this.getRandomColor());
      }
      this.codriverdata = tmpcodriverdata;
      for (const key in this.psmanufacturer) {
        const tmptime = this.Stagetimes.filter(time => time.carObj.manufacturer === key)[0];
        tmpmanufacturerdata.labels.push(tmptime.manufacturerObj.name);
        tmpmanufacturerdata.datasets[0].data.push(this.psmanufacturer[key]);
        tmpmanufacturerdata.datasets[0].backgroundColor.push(this.getRandomColor());
      }
      this.manufacturerdata = tmpmanufacturerdata;
    }
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i = i + 1) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
