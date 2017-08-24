import { Country } from '../../models/country.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../shared/notification.service';
import { Headers, Http, Response } from '@angular/http';

@Injectable()
export class InsertService {

  constructor(private http: Http, private notificationService: NotificationService) {
  }

  insertcountry(country: Country) {
    const body = JSON.stringify(country);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post('http://localhost:3000/user', body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

}

