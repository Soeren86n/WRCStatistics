import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../shared/getdata.service';
import { Rallycar } from '../models/rallycar.model';
import { Rally } from '../models/rally.model';
import { SelectItem } from 'primeng/primeng';
import { Rallymeterdifference } from '../models/rallymeterdifference.model';

@Component({
  selector: 'app-meterdifference',
  templateUrl: 'meterdifference.component.html',
})

export class MeterdifferenceComponent implements OnInit {
  data: any;
  options: any;
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
        xAxes: [{
          ticks: {
            beginAtZero: true,
            reverse: true,
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
    this.getService.getMeterdifference(this.rallyselected, tmpRallyCars)
      .subscribe(
        (resultobj: Rallymeterdifference[]) => {
          const tmpStage = [];
          tmpdata.labels = [];
          const fastesttime = [];
          for (const position of resultobj) {
            tmpStage[+position.stage - 1] = position.stage;
            if (!fastesttime[+position.stage] || position.time < fastesttime[+position.stage]) {
              fastesttime[+position.stage] = position.time;
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
                const reach = +position.meterpersecond * fastesttime[position.stage];
                const distance = +position.meter - reach;
                meter[+position.stage - 1] = distance.toFixed(2);
              }
            }
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
          console.log(this.data);
        },
      );
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
