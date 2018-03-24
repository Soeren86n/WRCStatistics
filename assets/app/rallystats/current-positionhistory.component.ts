import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../shared/getdata.service';
import { Positionhistory } from '../models/positionhistory.model';
import { SelectItem } from 'primeng/primeng';
import { Rally } from '../models/rally.model';
import { Rallycar } from '../models/rallycar.model';
import { allcolors, Colorcode } from '../models/color.model';

@Component({
  selector: 'app-currentpositionhistory',
  templateUrl: 'current-positionhistory.component.html',
})
export class CurrentPositionhistoryComponent implements OnInit {
  data: any;
  options: any;
  positions: Positionhistory[];
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
      tooltips: {
        mode: 'nearest',
        intersect: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
              reverse: true,
              stepSize: 1,
            },
          },
        ],
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
        this.getCars();
      }
    });
  }

  getCars() {
    this.data = {
      labels: [],
      datasets: [],
    };
    this.getService.getRallyCar(this.rallyselected).subscribe((cars: Rallycar[]) => {
      this.rallycars = cars;
      this.selcars = [];
      this.selectedCars = [];
      for (const car of this.rallycars) {
        this.selcars.push({
          label: '#' + car.startnumber + ' ' + car.carObj.driverObj.firstname + ' ' + car.carObj.driverObj.lastname,
          value: car.carID,
        });
      }
    });
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
      const tmpCar = this.rallycars.filter((car) => car.carID === selCar)[0];
      const tmpRallyCar = new Rallycar(
        tmpCar.startnumber,
        this.rallyselected,
        tmpCar.carID,
        tmpCar.rallycarID,
        tmpCar.carObj,
        tmpCar.rallyObj,
      );
      tmpRallyCars.push(tmpRallyCar);
    }
    this.getService.getPositionHistory(this.rallyselected, tmpRallyCars).subscribe((positions: Positionhistory[]) => {
      this.positions = positions;
      const tmpStage = [];
      tmpdata.labels = [];
      for (const position of this.positions) {
        tmpStage[+position.stage - 1] = position.stage;
      }
      for (const stage of tmpStage) {
        if (stage) {
          tmpdata.labels.push(stage);
        }
      }
      for (const car of tmpRallyCars) {
        const tmpDriverlabel = car.carObj.driverObj.firstname + ' ' + car.carObj.driverObj.lastname;
        const stage = [];
        for (const position of this.positions) {
          if (position.driver === car.carObj.driver) {
            stage[+position.stage - 1] = position.position;
          }
        }
        const Tempdata = {
          label: tmpDriverlabel,
          data: stage,
          lineTension: 0.2,
          borderColor: this.getRandomColor(),
        };
        tmpdata.datasets.push(Tempdata);
      }
      this.data = tmpdata;
    });
  }

  getFlagCode(rallyid: string) {
    const tmpRally = this.rallys.filter((rally) => rally.rallyID === rallyid)[0];
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
}
