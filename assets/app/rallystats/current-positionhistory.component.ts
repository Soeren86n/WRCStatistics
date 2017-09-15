import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../shared/getdata.service';
import { Positionhistory } from '../models/positionhistory.model';
import { SelectItem } from 'primeng/primeng';
import { Rally } from '../models/rally.model';
import { Rallycar } from '../models/rallycar.model';
import { Rallymeterdifference } from '../models/rallymeterdifference.model';

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
            stepSize: 1,
          },
        }],
      },
    };
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
            this.getCars();
          }
        },
      );
  }

  getCars() {
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
        (positions: Positionhistory[]) => {
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
        },
      );
  }

  getotaltimeinSeconds(time: string) {
    const splittime = time.split(':');
    let seconds = +splittime[0] * 60;
    seconds = seconds + +splittime[1];
    return seconds;
  }

  getFlagCode(rallyid: string) {
    const tmpRally = this.rallys.filter(rally => rally.rallyID === rallyid)[0];
    return tmpRally.countryObj.shortname.toLowerCase();
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
