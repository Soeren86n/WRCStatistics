import { Driver } from './driver.model';
import { Codriver } from './codriver.model';
import { Manufacturer } from './manufacturer.model';

export class Car {
  constructor(public startnumber: number,
              public year: number,
              public driver: string,
              public codriver: string,
              public manufacturer: string,
              public carID?: string,
              public driverObj?: Driver,
              public codriverObj?: Codriver,
              public manufacturerObj?: Manufacturer,
  ) {
  }
}
