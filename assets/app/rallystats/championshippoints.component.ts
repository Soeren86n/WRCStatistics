import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../shared/getdata.service';
import { Rallycar } from '../models/rallycar.model';
import { Rally } from '../models/rally.model';
import { SelectItem } from 'primeng/primeng';
import { Rallymeterdifference } from '../models/rallymeterdifference.model';
import { allcolors, Colorcode } from '../models/color.model';
import { Stage } from '../models/stage.model';
import { Car } from '../models/car.model';
import { Championshippoint } from '../models/championshippoint.model';

@Component({
  selector: 'app-championshippoints',
  templateUrl: 'championshippoints.component.html',
})

export class ChampionshippointsComponent implements OnInit {
  data: any;
  options: any;
  colors: Colorcode[] = [];
  allorigcolors: Colorcode[] = [];
  selcars: SelectItem[] = [];
  selectedData: string[] = [];
  ChPoints: Championshippoint[] = [];
  allDriver = [];
  allCoDriver = [];
  allRally = [];
  selLabel = 'Driver';
  chtype = 'driver';
  year = 2017;

  constructor(private getService: GetdataService) {
    this.data = {
      labels: ['Januar', 'Februar', 'Januar', 'Februar', 'Januar', 'Februar', 'Last'],
      datasets: [
        {
          type: 'line',
          label: 'Ogier',
          data: [25, 44, 66, 88, 102, 128, 141],
          fill: false,
          lineTension: 0.2,
          borderColor: '#4bc0c0',
          backgroundColor: '#4bc0c0',
        },
        {
          type: 'line',
          label: 'Neuville',
          data: [5, 7, 20, 20, 45, 62, 87],
          fill: false,
          lineTension: 0.2,
          borderColor: '#565656',
          backgroundColor: '#565656',
        },
        {
          type: 'bar',
          label: 'Ogier',
          data: [25, 19, 22, 22, 14, 26, 13],
          backgroundColor: '#4bc0c0',
        },
        {
          type: 'bar',
          label: 'Neuville',
          stack: 'Neuville',
          data: [5, 3, 15, 25, 18, 18, 15],
          backgroundColor: '#565656',
        },
        {
          type: 'bar',
          label: 'Neuville',
          stack: 'Neuville',
          data: [0, 0, 5, 1, 4, 4, 2],
          backgroundColor: '#cecece',
        },
      ],
    };
    this.options = {
      title: {
        display: false,
      },
      legend: {
        display: false,
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
        xAxes: [{
          ticks: {
            beginAtZero: true,
            reverse: false,
          },
        }],
      },
    };
  }

  ngOnInit() {
    for (const color of allcolors) {
      this.allorigcolors.push(color);
      this.colors.push(color);
    }
    this.getGraphdata();
  }

  getGraphdata() {
    this.getService.getChampionshippoints(this.year)
      .subscribe(
        (points: Championshippoint[]) => {
          this.ChPoints = points;
          for (const point of this.ChPoints) {
            this.allDriver[point.driver] = point.driverObj.firstname + ' ' + point.driverObj.lastname;
            this.allCoDriver[point.codriver] = point.codriverObj.firstname + ' ' + point.codriverObj.lastname;
            this.allRally[point.rallyObj.rallyID] = new Date(point.date).getTime();
          }
          this.allRally.sort();
          this.onChangeChtype();
        },
      );
  }

  onChangeChtype() {
    this.selcars = [];
    this.selectedData = [];
    switch (this.chtype) {
      case 'driver':
        this.selLabel = 'Driver';
        for (const key in this.allDriver) {
          this.selcars.push({
            label: this.allDriver[key],
            value: key,
          });
        }
        break;
      case 'codriver':
        this.selLabel = 'Codriver';
        for (const key in this.allCoDriver) {
          this.selcars.push({
            label: this.allCoDriver[key],
            value: key,
          });
        }
        break;
    }
  }

  setGraphdata() {
    const tmpdata = {
      labels: [],
      datasets: [],
    };
    switch (this.chtype) {
      case 'driver':
        for (const key in this.allRally) {
          const tmpCar = this.ChPoints.filter(car => car.rallyObj.rallyID === key)[0];
          tmpdata.labels.push(tmpCar.rallyObj.name);
        }
        for (const driver of this.selectedData) {
          const pointsperRally = [];
          const powerpointsperRally = [];
          let tmpLbl = '';
          for (const point of this.ChPoints) {
            if (point.driverObj.driverID === driver) {
              tmpLbl = point.driverObj.firstname + ' ' + point.driverObj.lastname;
              switch (point.type) {
                case 'power':
                  powerpointsperRally[point.rallyObj.rallyID] = point.points;
                  break;
                case 'rally':
                  pointsperRally[point.rallyObj.rallyID] = point.points;
                  break;
              }
            }
          }
          const dataLine = [];
          const datapower = [];
          const datarally = [];
          let wholepoints = 0;
          for (const key in this.allRally) {
            let rallypoint = 0;
            let powerpoint = 0;
            if (powerpointsperRally[key]) {
              datapower.push(powerpointsperRally[key]);
              powerpoint = powerpointsperRally[key];
            } else {
              datapower.push(0);
            }
            if (pointsperRally[key]) {
              datarally.push(pointsperRally[key]);
              rallypoint = pointsperRally[key];
            } else {
              datarally.push(0);
            }
            wholepoints = wholepoints + powerpoint + rallypoint;
            dataLine.push(wholepoints);
          }
          const tmpColor = this.getRandomColor();
          const tmpColor2 = this.getRandomColor();
          const tmpLine = {
            type: 'line',
            label: tmpLbl,
            data: dataLine,
            fill: false,
            lineTension: 0.2,
            borderColor: tmpColor,
            backgroundColor: tmpColor,
          };
          const tmpPower = {
            type: 'bar',
            label: tmpLbl,
            stack: tmpLbl,
            data: datapower,
            backgroundColor: tmpColor2,
            borderColor: tmpColor,
            borderWidth: 4,
          };
          const tmpRally = {
            type: 'bar',
            label: tmpLbl,
            stack: tmpLbl,
            data: datarally,
            backgroundColor: tmpColor,
          };
          tmpdata.datasets.push(tmpLine);
          tmpdata.datasets.push(tmpPower);
          tmpdata.datasets.push(tmpRally);
        }
        this.data = tmpdata;
        break;
      case 'codriver':
        for (const key in this.allRally) {
          const tmpCar = this.ChPoints.filter(car => car.rallyObj.rallyID === key)[0];
          tmpdata.labels.push(tmpCar.rallyObj.name);
        }
        for (const driver of this.selectedData) {
          const pointsperRally = [];
          const powerpointsperRally = [];
          let tmpLbl = '';
          for (const point of this.ChPoints) {
            if (point.codriverObj.codriverID === driver) {
              tmpLbl = point.codriverObj.firstname + ' ' + point.codriverObj.lastname;
              switch (point.type) {
                case 'power':
                  powerpointsperRally[point.rallyObj.rallyID] = point.points;
                  break;
                case 'rally':
                  pointsperRally[point.rallyObj.rallyID] = point.points;
                  break;
              }
            }
          }
          const dataLine = [];
          const datapower = [];
          const datarally = [];
          let wholepoints = 0;
          for (const key in this.allRally) {
            let rallypoint = 0;
            let powerpoint = 0;
            if (powerpointsperRally[key]) {
              datapower.push(powerpointsperRally[key]);
              powerpoint = powerpointsperRally[key];
            } else {
              datapower.push(0);
            }
            if (pointsperRally[key]) {
              datarally.push(pointsperRally[key]);
              rallypoint = pointsperRally[key];
            } else {
              datarally.push(0);
            }
            wholepoints = wholepoints + powerpoint + rallypoint;
            dataLine.push(wholepoints);
          }
          const tmpColor = this.getRandomColor();
          const tmpColor2 = this.getRandomColor();
          const tmpLine = {
            type: 'line',
            label: tmpLbl,
            data: dataLine,
            fill: false,
            lineTension: 0.2,
            borderColor: tmpColor,
            backgroundColor: tmpColor,
          };
          const tmpPower = {
            type: 'bar',
            label: tmpLbl,
            stack: tmpLbl,
            data: datapower,
            backgroundColor: tmpColor2,
            borderColor: tmpColor,
            borderWidth: 4,
          };
          const tmpRally = {
            type: 'bar',
            label: tmpLbl,
            stack: tmpLbl,
            data: datarally,
            backgroundColor: tmpColor,
          };
          tmpdata.datasets.push(tmpLine);
          tmpdata.datasets.push(tmpPower);
          tmpdata.datasets.push(tmpRally);
        }
        this.data = tmpdata;
        break;
    }
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
