import { Country } from './country.model';

export class Manufacturer {
  constructor(public name: string,
              public country: string,
              public manufacturerID?: string,
              public countryObj?: Country) {
  }
}
