import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../shared/getdata.service';
import { Positionhistory } from '../models/positionhistory.model';
import { SelectItem } from 'primeng/primeng';
import { Rally } from '../models/rally.model';
import { Rallycar } from '../models/rallycar.model';
import { allcolors, Colorcode } from '../models/color.model';
import { Rallymeterdifference } from '../models/rallymeterdifference.model';

@Component({
  selector: 'app-currenttimedistance',
  templateUrl: 'current-timedistance.component.html',
})

export class CurrentTimedistanceComponent implements OnInit {
  data: any;
  options: any;
  distance: Rallymeterdifference[];
  rallys: Rally[] = [];
  selrallys: SelectItem[] = [];
  selcars: SelectItem[] = [];
  rallyselected = '';
  rallycars: Rallycar[] = [];
  selectedCars: string[] = [];
  colors: Colorcode[] = [];
  allorigcolors: Colorcode[] = [];

  constructor(private getService: GetdataService) {
    this.data = {
      labels: [],
      datasets: [],
    };
    this.options = {
      title: {
        display: false,
      },
      legend: {
        position: 'bottom',
      },
      elements: {
        line: {
          fill: false,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false,
            reverse: true,
          },
        }],
      },
    };
  }

  ngOnInit() {
    this.getRallys();
    for (const color of allcolors) {
      this.allorigcolors.push(color);
      this.colors.push(color);
    }
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
            this.getCars();
          }
        },
      );
  }

  getCars() {
    this.data = {
      labels: [],
      datasets: [],
    };
    this.getService.getRallyCar(this.rallyselected)
      .subscribe(
        (cars: Rallycar[]) => {
          this.rallycars = cars;
          this.selcars = [];
          this.selectedCars = [];
          for (const car of this.rallycars) {
            this.selcars.push({
              label: '#' + car.startnumber + ' ' + car.carObj.driverObj.firstname + ' ' + car.carObj.driverObj.lastname,
              value: car.carID,
            });
          }
        },
      );
  }


  getGraphdata() {
    this.colors = [];
    for (const color of this.allorigcolors) {
      this.colors.push(color);
    }
    const tmpdata = {
      labels: [],
      datasets: [],
    };
    const tmpRallyCars: Rallycar[] = [];
    for (const selCar of this.selectedCars) {
      const tmpCar = this.rallycars.filter(car => car.carID === selCar)[0];
      const tmpRallyCar = new Rallycar(
        tmpCar.startnumber,
        this.rallyselected,
        tmpCar.carID, tmpCar.rallycarID, tmpCar.carObj, tmpCar.rallyObj);
      tmpRallyCars.push(tmpRallyCar);
    }
    this.getService.getPositionHistory(this.rallyselected, tmpRallyCars)
      .subscribe(
        (resultobj: Positionhistory[]) => {
          const tmpStage = [];
          tmpdata.labels = [];
          const fastesttime = [];
          for (const position of resultobj) {
            tmpStage[+position.stage - 1] = position.stage;
            if (!fastesttime[+position.stage] || this.getotaltimeinSeconds(position.time) < +fastesttime[+position.stage]) {
              fastesttime[+position.stage] = this.getotaltimeinSeconds(position.time);
            }
          }
          for (const stage of tmpStage) {
            if (stage) {
              tmpdata.labels.push(stage);
            }
          }
          for (const car of tmpRallyCars) {
            const tmpDriverlabel = car.carObj.driverObj.firstname + ' ' + car.carObj.driverObj.lastname;
            const meter = [];
            for (const position of resultobj) {
              if (position.driver === car.carObj.driver) {
                const reach =   this.getotaltimeinSeconds(position.time) - fastesttime[position.stage];
                meter.push(reach.toFixed(2));
              }
            }
            const Tempdata = {
              label: tmpDriverlabel,
              data: meter,
              lineTension: 0.2,
              borderColor: this.getRandomColor(),
            };
            tmpdata.datasets.push(Tempdata);
          }
          this.data = tmpdata;
        },
      );
  }

  getFlagCode(rallyid: string) {
    const tmpRally = this.rallys.filter(rally => rally.rallyID === rallyid)[0];
    return tmpRally.countryObj.shortname.toLowerCase();
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

  getotaltimeinSeconds(time: string) {
    const splittime = time.split(':');
    let seconds = 0;
    let minutes = 0;
    if (splittime.length === 2) {
      seconds = +splittime[0] * 60;
      seconds = seconds + +splittime[1];
    } else if (splittime.length === 3) {
      minutes = +splittime[0] * 60 * 60;
      seconds = +splittime[1] * 60;
      seconds = minutes + seconds + +splittime[2];
    } else {
      seconds = +splittime;
    }
    return seconds;
  }

}
