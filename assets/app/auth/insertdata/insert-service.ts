import { Country } from '../../models/country.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../shared/notification.service';
import { Headers, Http, Response } from '@angular/http';
import { Rally } from '../../models/rally.model';
import { Stage } from '../../models/stage.model';
import { Manufacturer } from '../../models/manufacturer.model';
import { Driver } from '../../models/driver.model';
import { Codriver } from '../../models/codriver.model';
import { Car } from '../../models/car.model';
import { Rallycar } from '../../models/rallycar.model';
import { Stagetime } from '../../models/stagetime.model';

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

  insertmanufacturer(manufacturer: Manufacturer) {
    const body = JSON.stringify(manufacturer);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.post('http://localhost:3000/admin/insertmanufacturer/' + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  updatemanufacturer(manufacturer: Manufacturer) {
    const body = JSON.stringify(manufacturer);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.patch('http://localhost:3000/admin/updatemanufacturer/' + manufacturer.manufacturerID + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  insertdriver(driver: Driver) {
    const body = JSON.stringify(driver);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.post('http://localhost:3000/admin/insertdriver/' + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  updatedriver(driver: Driver) {
    const body = JSON.stringify(driver);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.patch('http://localhost:3000/admin/updatedriver/' + driver.driverID + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  insertcodriver(codriver: Codriver) {
    const body = JSON.stringify(codriver);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.post('http://localhost:3000/admin/insertcodriver/' + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  updatecodriver(codriver: Codriver) {
    const body = JSON.stringify(codriver);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.patch('http://localhost:3000/admin/updatecodriver/' + codriver.codriverID + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  insertcar(car: Car) {
    const body = JSON.stringify(car);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.post('http://localhost:3000/admin/insertcar/' + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  updatecar(car: Car) {
    const body = JSON.stringify(car);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.patch('http://localhost:3000/admin/updatecar/' + car.carID + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  insertrallycar(car: Rallycar[]) {
    const body = JSON.stringify(car);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.post('http://localhost:3000/admin/insertrallycar/' + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  insertstagetime(stagetime: Stagetime[]) {
    const body = JSON.stringify(stagetime);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token')
      ? '?token=' + localStorage.getItem('token')
      : '';
    return this.http.post('http://localhost:3000/admin/insertstagetime/' + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }
}

