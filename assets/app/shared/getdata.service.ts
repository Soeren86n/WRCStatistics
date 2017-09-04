import { Country } from '../models/country.model';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NotificationService } from './notification.service';
import { Observable } from 'rxjs/Observable';
import { Rally } from '../models/rally.model';
import { Stage } from '../models/stage.model';

@Injectable()
export class GetdataService {

  constructor(private http: Http, private notificationService: NotificationService) {
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
        return countryObjs;
      })
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  getRallys() {
    return this.http.get('http://localhost:3000/data/rally')
      .map((response: Response) => {
        const rallys = response.json().obj;
        const RallyObjs: Rally[] = [];
        for (const rally of rallys) {
          const countryobj = new Country(rally.country.name, rally.country.shortname, rally.country._id);
          RallyObjs.push(new Rally(
            rally.name,
            rally.country.name,
            rally.startdate,
            rally.enddate,
            rally._id,
            countryobj,
            ),
          )
          ;
        }
        return RallyObjs;
      })
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  getStages() {
    return this.http.get('http://localhost:3000/data/stage')
      .map((response: Response) => {
        const stages = response.json().obj;
        const StageObjs: Stage[] = [];
        for (const stage of stages) {
          const rallyobj = new Rally(stage.rally.name, stage.rally.country, stage.rally.startdate, stage.rally.enddate, stage.rally._id);
          StageObjs.push(
            new Stage(
              stage.name,
              stage.day,
              stage.date,
              stage.cancelled,
              stage.powerstage,
              stage.stagenumber,
              stage.meter,
              stage.rally.name,
              stage._id,
              rallyobj,
            ));
        }
        return StageObjs;
      })
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }
  getRallyStages(id: string) {
    return this.http.get('http://localhost:3000/data/rally/stage/' + id)
      .map((response: Response) => {
        const stages = response.json().obj;
        const StageObjs: Stage[] = [];
        for (const stage of stages) {
          const rallyobj = new Rally(stage.rally.name, stage.rally.country, stage.rally.startdate, stage.rally.enddate, stage.rally._id);
          StageObjs.push(
            new Stage(
              stage.name,
              stage.day,
              stage.date,
              stage.cancelled,
              stage.powerstage,
              stage.stagenumber,
              stage.meter,
              stage.rally.name,
              stage._id,
              rallyobj,
            ));
        }
        return StageObjs;
      })
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }
}
