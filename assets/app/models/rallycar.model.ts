import { Rally } from './rally.model';
import { Car } from './car.model';

export class Rallycar {
  constructor(
    public startnumber: number,
    public rally: string,
    public carID: string,
    public rallycarID?: string,
    public carObj?: Car,
    public rallyObj?: Rally,
  ) {}
}
