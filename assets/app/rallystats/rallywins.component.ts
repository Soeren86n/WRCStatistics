import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../shared/getdata.service';
import { Stagetime } from '../models/stagetime.model';
import { SelectItem } from 'primeng/primeng';
import { allcolors, Colorcode } from '../models/color.model';


@Component({
  selector: 'app-rallywins',
  templateUrl: 'rallywins.component.html',
})

export class RallywinsComponent implements OnInit {
  driverdata: any;
  codriverdata: any;
  manufacturerdata: any;
  options: any;
  colors: Colorcode[] = [];
  allorigcolors: Colorcode[] = [];
  selyears: SelectItem[] = [];
  Stagetimes: Stagetime[] = [];
  rallyselected = '';
  driver = [];
  codriver = [];
  manufacturer = [];
  rallydriver = [];
  rallycodriver = [];
  rallymanufacturer = [];
  yearselected = 0;

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
    this.selyears.push({ label: 'All Time', value: 0 });

    const tmpdate = new Date();
    const tmpYear = tmpdate.getFullYear();
    this.yearselected = 0;
    for (let i = 2017; i <= tmpYear; i = i + 1) {
      this.selyears.push({ label: i + '', value: i });
    }

  }

  ngOnInit() {
    this.getRallywins();
    for (const color of allcolors) {
      this.allorigcolors.push(color);
      this.colors.push(color);
    }
  }

  getRallywins() {
    this.getService.getRallywins()
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
      }
    }
    this.setPieDataforAll();
  }


  setPieDataforYear() {
    this.colors = [];
    for (const color of this.allorigcolors) {
      this.colors.push(color);
    }
    if (this.yearselected === 0) {
      this.setPieDataforAll();
    } else {
      this.rallydriver = [];
      this.rallycodriver = [];
      this.rallymanufacturer = [];
      for (const time of this.Stagetimes) {
        const tmpdate = new Date(time.rallyObj.startdate);
        const tmpYear = tmpdate.getFullYear();
        if (!time.stageObj.cancelled && tmpYear === this.yearselected) {
          if (!this.rallydriver[time.carObj.driver]) {
            this.rallydriver[time.carObj.driver] = 1;
          } else {
            this.rallydriver[time.carObj.driver] = this.rallydriver[time.carObj.driver] + 1;
          }
          if (!this.rallycodriver[time.carObj.codriver]) {
            this.rallycodriver[time.carObj.codriver] = 1;
          } else {
            this.rallycodriver[time.carObj.codriver] = this.rallycodriver[time.carObj.codriver] + 1;
          }
          if (!this.rallymanufacturer[time.carObj.manufacturer]) {
            this.rallymanufacturer[time.carObj.manufacturer] = 1;
          } else {
            this.rallymanufacturer[time.carObj.manufacturer] = this.rallymanufacturer[time.carObj.manufacturer] + 1;
          }
        }
      }
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
      for (const key in this.rallydriver) {
        const tmptime = this.Stagetimes.filter(time => time.carObj.driver === key)[0];
        tmpdriverdata.labels.push(tmptime.driverObj.firstname + ' ' + tmptime.driverObj.lastname);
        tmpdriverdata.datasets[0].data.push(this.rallydriver[key]);
        tmpdriverdata.datasets[0].backgroundColor.push(this.getRandomColor());
      }
      this.driverdata = tmpdriverdata;
      for (const key in this.rallycodriver) {
        const tmptime = this.Stagetimes.filter(time => time.carObj.codriver === key)[0];
        tmpcodriverdata.labels.push(tmptime.codriverObj.firstname + ' ' + tmptime.codriverObj.lastname);
        tmpcodriverdata.datasets[0].data.push(this.rallycodriver[key]);
        tmpcodriverdata.datasets[0].backgroundColor.push(this.getRandomColor());
      }
      this.codriverdata = tmpcodriverdata;
      for (const key in this.rallymanufacturer) {
        const tmptime = this.Stagetimes.filter(time => time.carObj.manufacturer === key)[0];
        tmpmanufacturerdata.labels.push(tmptime.manufacturerObj.name);
        tmpmanufacturerdata.datasets[0].data.push(this.rallymanufacturer[key]);
        tmpmanufacturerdata.datasets[0].backgroundColor.push(this.getRandomColor());
      }
      this.manufacturerdata = tmpmanufacturerdata;
    }
  }


  setPieDataforAll() {
    this.colors = [];
    for (const color of this.allorigcolors) {
      this.colors.push(color);
    }
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
  }

  getRandomColor() {
    if (this.colors.length < 2) {
      this.colors = [];
      for (const color of this.allorigcolors) {
        this.colors.push(color);
      }
    }

    let random = Math.floor(Math.random() * 36);
    while (!this.colors[random]) {
      random = Math.floor(Math.random() * 36);
    }
    const colorhex = this.colors[random].hexcode;
    this.colors.splice(random, 1);
    return colorhex;
  }


}
