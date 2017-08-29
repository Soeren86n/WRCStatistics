import { Country } from '../../models/country.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../shared/notification.service';
import { Headers, Http, Response } from '@angular/http';
import { Rally } from '../../models/rally.model';

@Injectable()
export class InsertService {

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

  insertrally(rally: Rally) {
    const body = JSON.stringify(rally);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.post('http://localhost:3000/admin/insertrally/' + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

}

