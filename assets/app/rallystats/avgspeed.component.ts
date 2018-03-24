import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../shared/getdata.service';
import { Rallycar } from '../models/rallycar.model';
import { Rally } from '../models/rally.model';
import { SelectItem } from 'primeng/primeng';
import { Rallymeterdifference } from '../models/rallymeterdifference.model';
import { allcolors, Colorcode } from '../models/color.model';
import { Stage } from '../models/stage.model';

@Component({
  selector: 'app-avgspeed',
  templateUrl: 'avgspeed.component.html',
})
export class AvgspeedComponent implements OnInit {
  data: any;
  options: any;
  rallys: Rally[] = [];
  stages: Stage[] = [];
  selrallys: SelectItem[] = [];
  selcars: SelectItem[] = [];
  selstages: SelectItem[] = [];
  rallyselected = '';
  selectedStages: string[] = [];
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
        mode: 'index',
        intersect: true,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              reverse: true,
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
      this.getStages();
    });
  }

  getStages() {
    this.getService.getRallyStages(this.rallyselected).subscribe((stages: Stage[]) => {
      this.selectedStages = [];
      this.stages = stages;
      this.selstages = [];
      for (const stage of this.stages) {
        this.selstages.push({
          label: '#' + stage.stagenumber + ' ' + stage.name + ' - ' + stage.meter / 1000 + ' km',
          value: stage.StageID,
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
    this.getService.getMeterdifference(this.rallyselected, tmpRallyCars).subscribe((resultobj: Rallymeterdifference[]) => {
      const tmpStage = [];
      tmpdata.labels = [];
      for (const position of resultobj) {
        if (this.selectedStages.indexOf(position.stageObj.StageID) > -1 && !position.stageObj.cancelled) {
          tmpStage[+position.stage - 1] = position.stage;
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
          if (
            position.driver === car.carObj.driver &&
            this.selectedStages.indexOf(position.stageObj.StageID) > -1 &&
            !position.stageObj.cancelled
          ) {
            const distance = +position.meterpersecond * 3.6;
            meter.push({ x: position.stage, y: distance.toFixed(2) });
          }
        }
        meter.sort((a, b) => {
          return a.x > b.x ? 1 : b.x > a.x ? -1 : 0;
        });
        const colorfield = this.getRandomColor();
        const Tempdata = {
          label: tmpDriverlabel,
          data: meter,
          backgroundColor: colorfield,
          borderColor: colorfield,
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
