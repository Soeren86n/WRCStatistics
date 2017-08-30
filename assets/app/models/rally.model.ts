import { Country } from './country.model';

export class Rally {
  constructor(public name: string,
              public country: string,
              public startdate: string,
              public enddate: string,
              public rallyID?: string,
              public countryObj?: Country) {
  }
}
