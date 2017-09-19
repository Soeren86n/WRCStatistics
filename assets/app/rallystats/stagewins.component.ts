import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../shared/getdata.service';
import { Stagetime } from '../models/stagetime.model';


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
    const driver = [];
    const codriver = [];
    const manufacturer = [];
    const psdriver = [];
    const pscodriver = [];
    const psmanufacturer = [];
    for (const time of this.Stagetimes) {
      if (!time.stageObj.cancelled) {
        if (!driver[time.carObj.driver]) {
          driver[time.carObj.driver] = 1;
        } else {
          driver[time.carObj.driver] = driver[time.carObj.driver] + 1;
        }
        if (!codriver[time.carObj.codriver]) {
          codriver[time.carObj.codriver] = 1;
        } else {
          codriver[time.carObj.codriver] = codriver[time.carObj.codriver] + 1;
        }
        if (!manufacturer[time.carObj.manufacturer]) {
          manufacturer[time.carObj.manufacturer] = 1;
        } else {
          manufacturer[time.carObj.manufacturer] = manufacturer[time.carObj.manufacturer] + 1;
        }
        if (time.stageObj.powerstage) {
          if (!psdriver[time.carObj.driver]) {
            psdriver[time.carObj.driver] = 1;
          } else {
            psdriver[time.carObj.driver] = psdriver[time.carObj.driver] + 1;
          }
          if (!pscodriver[time.carObj.codriver]) {
            pscodriver[time.carObj.codriver] = 1;
          } else {
            pscodriver[time.carObj.codriver] = pscodriver[time.carObj.codriver] + 1;
          }
          if (!psmanufacturer[time.carObj.manufacturer]) {
            psmanufacturer[time.carObj.manufacturer] = 1;
          } else {
            psmanufacturer[time.carObj.manufacturer] = psmanufacturer[time.carObj.manufacturer] + 1;
          }
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
    for (const key in driver) {
      const tmptime = this.Stagetimes.filter(time => time.carObj.driver === key)[0];
      tmpdriverdata.labels.push(tmptime.driverObj.firstname + ' ' + tmptime.driverObj.lastname);
      tmpdriverdata.datasets[0].data.push(driver[key]);
      tmpdriverdata.datasets[0].backgroundColor.push(this.getRandomColor());
    }
    this.driverdata = tmpdriverdata;
    for (const key in codriver) {
      const tmptime = this.Stagetimes.filter(time => time.carObj.codriver === key)[0];
      tmpcodriverdata.labels.push(tmptime.codriverObj.firstname + ' ' + tmptime.codriverObj.lastname);
      tmpcodriverdata.datasets[0].data.push(codriver[key]);
      tmpcodriverdata.datasets[0].backgroundColor.push(this.getRandomColor());
    }
    this.codriverdata = tmpcodriverdata;
    for (const key in manufacturer) {
      const tmptime = this.Stagetimes.filter(time => time.carObj.manufacturer === key)[0];
      tmpmanufacturerdata.labels.push(tmptime.manufacturerObj.name);
      tmpmanufacturerdata.datasets[0].data.push(manufacturer[key]);
      tmpmanufacturerdata.datasets[0].backgroundColor.push(this.getRandomColor());
    }
    this.manufacturerdata = tmpmanufacturerdata;
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
