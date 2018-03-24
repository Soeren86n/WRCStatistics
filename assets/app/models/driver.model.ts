import { Country } from './country.model';

export class Driver {
  constructor(
    public firstname: string,
    public lastname: string,
    public country: string,
    public driverID?: string,
    public countryObj?: Country,
  ) {}
}
