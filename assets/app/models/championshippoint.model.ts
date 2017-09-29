import { Driver } from './driver.model';
import { Rally } from './rally.model';
import { Manufacturer } from './manufacturer.model';
import { Codriver } from './codriver.model';

export class Championshippoint {
  constructor(public points: number,
              public type: string,
              public date: string,
              public rally: string,
              public driver: string,
              public codriver: string,
              public manufacturer: string,
              public driverObj?: Driver,
              public codriverObj?: Codriver,
              public manufacturerObj?: Manufacturer,
              public rallyObj?: Rally) {
  }
}

