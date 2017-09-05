import { Country } from '../../models/country.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../shared/notification.service';
import { Headers, Http, Response } from '@angular/http';
import { Rally } from '../../models/rally.model';
import { Stage } from '../../models/stage.model';

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

  updaterally(rally: Rally) {
    const body = JSON.stringify(rally);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.patch('http://localhost:3000/admin/updaterally/' + rally.rallyID + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  deleteRally(rally: Rally) {
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.delete('http://localhost:3000/admin/deleterally/' + rally.rallyID + token)
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  insertstage(stage: Stage) {
    const body = JSON.stringify(stage);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.post('http://localhost:3000/admin/insertstage/' + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  updatestage(stage: Stage) {
    const body = JSON.stringify(stage);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.patch('http://localhost:3000/admin/updatestage/' + stage.StageID + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  deleteStage(stage: Stage) {
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.delete('http://localhost:3000/admin/deletestage/' + stage.StageID + token)
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }
}

