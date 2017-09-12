import { Stage } from './stage.model';
import { Rally } from './rally.model';
import { Car } from './car.model';
import { Manufacturer } from './manufacturer.model';
import { Driver } from './driver.model';
import { Codriver } from './codriver.model';

export class Stagetime {
  constructor(public stage: string,
              public rally: string,
              public car: string,
              public time: string,
              public position: string,
              public manufacturer: string,
              public driver: string,
              public codriver: string,
              public stagetimeID?: string,
              public stageObj?: Stage,
              public rallyObj?: Rally,
              public carObj?: Car,
              public manufacturerObj?: Manufacturer,
              public driverObj?: Driver,
              public codriverObj?: Codriver,
              ) {
  }
}
