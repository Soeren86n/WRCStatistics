import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../shared/getdata.service';
import { Stagetime } from '../models/stagetime.model';
import { SelectItem } from 'primeng/primeng';
import { Rally } from '../models/rally.model';
import { allcolors, Colorcode } from '../models/color.model';


@Component({
  selector: 'app-stagewins',
  templateUrl: 'stagewins.component.html',
})

export class StagewinsComponent implements OnInit {
  driverdata: any;
  codriverdata: any;
  manufacturerdata: any;
  options: any;
  rallys: Rally[] = [];
  colors: Colorcode[] = [];
  allorigcolors: Colorcode[] = [];
  selrallys: SelectItem[] = [];
  selyears: SelectItem[] = [];
  Stagetimes: Stagetime[] = [];
  selectedPie = 'all';
  rallyselected = '';
  pietype: SelectItem[];
  driver = [];
  codriver = [];
  manufacturer = [];
  psdriver = [];
  pscodriver = [];
  psmanufacturer = [];
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
    this.pietype = [];
    this.pietype.push({ label: 'All Stages', value: 'all' });
    this.pietype.push({ label: 'Powerstages', value: 'power' });
    this.pietype.push({ label: 'Rally', value: 'rally' });
    this.selyears.push({ label: 'All Time', value: 0 });

    const tmpdate = new Date();
    const tmpYear = tmpdate.getFullYear();
    this.yearselected = 0;
    for (let i = 2017; i <= tmpYear; i = i + 1) {
      this.selyears.push({ label: i + '', value: i });
    }

  }

  ngOnInit() {
    this.getStagewins();
    this.getRallys();
    for (const color of allcolors) {
      this.allorigcolors.push(color);
      this.colors.push(color);
    }
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


  setPieData() {
    if (this.selectedPie === 'all') {
      this.setPieDataforAll();
    } else if (this.selectedPie === 'power') {
      this.setPieDataforPower();
    } else if (this.selectedPie === 'rally') {
      this.setPieDataforRally();
    }
  }

  setPieDataforYearSwitch() {
    if (this.selectedPie === 'all') {
      this.setPieDataforYear();
    } else if (this.selectedPie === 'power') {
      this.setPowerPieDataforYear();
    }
  }

  setPowerPieDataforYear() {
    this.colors = [];
    for (const color of this.allorigcolors) {
      this.colors.push(color);
    }
    if (this.yearselected === 0) {
      this.setPieDataforPower();
    } else {
      this.psdriver = [];
      this.pscodriver = [];
      this.psmanufacturer = [];
      for (const time of this.Stagetimes) {
        const tmpdate = new Date(time.rallyObj.startdate);
        const tmpYear = tmpdate.getFullYear();
        if (!time.stageObj.cancelled && tmpYear === this.yearselected && time.stageObj.powerstage) {
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

  setPieDataforRally() {
    this.colors = [];
    for (const color of this.allorigcolors) {
      this.colors.push(color);
    }
    this.rallydriver = [];
    this.rallycodriver = [];
    this.rallymanufacturer = [];
    for (const time of this.Stagetimes) {
      if (!time.stageObj.cancelled && time.stageObj.rally === this.rallyselected) {
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

  setPieDataforPower() {
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

  getFlagCode(rallyid: string) {
    const tmpRally = this.rallys.filter(rally => rally.rallyID === rallyid)[0];
    return tmpRally.countryObj.shortname.toLowerCase();
  }

}
