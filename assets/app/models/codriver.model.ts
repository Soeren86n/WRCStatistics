import { Country } from './country.model';

export class Codriver {
  constructor(
    public firstname: string,
    public lastname: string,
    public country: string,
    public codriverID?: string,
    public countryObj?: Country,
  ) {}
}
