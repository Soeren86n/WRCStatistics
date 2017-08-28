import { Country } from '../../models/country.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../shared/notification.service';
import { Headers, Http, Response } from '@angular/http';

@Injectable()
export class InsertService {
  private countrys: Country[] = [];

  constructor(private http: Http, private notificationService: NotificationService) {
  }

  insertcountry(country: Country) {
    const body = JSON.stringify(country);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.post('http://localhost:3000/admin/insertcountry/' + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  updatecountry(country: Country) {
    const body = JSON.stringify(country);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.patch('http://localhost:3000/admin/updatecountry/' + country.countryID + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  getCountrys() {
    return this.http.get('http://localhost:3000/data/country')
      .map((response: Response) => {
        const countrys = response.json().obj;
        const countryObjs: Country[] = [];
        for (const country of countrys) {
          countryObjs.push(new Country(
            country.name,
            country.shortname,
            country._id),
          );
        }
        this.countrys = countryObjs;
        return this.countrys;
      })
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

}

