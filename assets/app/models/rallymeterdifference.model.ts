import { Driver } from './driver.model';
import { Stage } from './stage.model';
import { Rally } from './rally.model';
import { Car } from './car.model';

export class Rallymeterdifference {
  constructor(public position: number,
              public meter: number,
              public time: string,
              public meterpersecond: string,
              public driver: string,
              public stage: string,
              public rally: string,
              public car: string,
              public driverObj?: Driver,
              public stageObj?: Stage,
              public rallyObj?: Rally,
              public carObj?: Car) {
  }
}

