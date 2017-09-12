import { Country } from '../models/country.model';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NotificationService } from './notification.service';
import { Observable } from 'rxjs/Observable';
import { Rally } from '../models/rally.model';
import { Stage } from '../models/stage.model';
import { Manufacturer } from '../models/manufacturer.model';
import { Driver } from '../models/driver.model';
import { Codriver } from '../models/codriver.model';
import { Car } from '../models/car.model';
import { Rallycar } from '../models/rallycar.model';
import { Stagetime } from '../models/stagetime.model';

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

  getManufacturer() {
    return this.http.get('http://localhost:3000/data/manufacturer')
      .map((response: Response) => {
        const manufacturers = response.json().obj;
        const ManufacturerObjs: Manufacturer[] = [];
        for (const manu of manufacturers) {
          const countryobj = new Country(manu.country.name, manu.country.shortname, manu.country._id);
          ManufacturerObjs.push(new Manufacturer(
            manu.name,
            manu.country.name,
            manu._id,
            countryobj,
            ),
          )
          ;
        }
        return ManufacturerObjs;
      })
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  getDriver() {
    return this.http.get('http://localhost:3000/data/driver')
      .map((response: Response) => {
        const drivers = response.json().obj;
        const DriverObjs: Driver[] = [];
        for (const driver of drivers) {
          const countryobj = new Country(driver.country.name, driver.country.shortname, driver.country._id);
          DriverObjs.push(new Driver(
            driver.firstname,
            driver.lastname,
            driver.country.name,
            driver._id,
            countryobj,
            ),
          )
          ;
        }
        return DriverObjs;
      })
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  getCodriver() {
    return this.http.get('http://localhost:3000/data/codriver')
      .map((response: Response) => {
        const drivers = response.json().obj;
        const DriverObjs: Codriver[] = [];
        for (const driver of drivers) {
          const countryobj = new Country(driver.country.name, driver.country.shortname, driver.country._id);
          DriverObjs.push(new Codriver(
            driver.firstname,
            driver.lastname,
            driver.country.name,
            driver._id,
            countryobj,
            ),
          )
          ;
        }
        return DriverObjs;
      })
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  getCar() {
    return this.http.get('http://localhost:3000/data/car')
      .map((response: Response) => {
        const cars = response.json().obj;
        const CarsObj: Car[] = [];
        for (const car of cars) {
          const driverobj = new Driver(car.driver.firstname, car.driver.lastname, car.driver.country, car.driver._id);
          const codriverobj = new Codriver(car.codriver.firstname, car.codriver.lastname, car.codriver.country, car.codriver._id);
          const manufacturerobj = new Manufacturer(car.manufacturer.name, car.manufacturer.country, car.manufacturer._id);
          CarsObj.push(new Car(
            car.startnumber,
            car.year,
            car.driver.firstname + ' ' + car.driver.lastname,
            car.codriver.firstname + ' ' + car.codriver.lastname,
            car.manufacturer.name,
            car._id,
            driverobj,
            codriverobj,
            manufacturerobj,
            ),
          )
          ;
        }
        return CarsObj;
      })
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  getCarYear(year: number) {
    return this.http.get('http://localhost:3000/data/car/year/' + year)
      .map((response: Response) => {
        const cars = response.json().obj;
        const CarsObj: Car[] = [];
        for (const car of cars) {
          const driverobj = new Driver(car.driver.firstname, car.driver.lastname, car.driver.country, car.driver._id);
          const codriverobj = new Codriver(car.codriver.firstname, car.codriver.lastname, car.codriver.country, car.codriver._id);
          const manufacturerobj = new Manufacturer(car.manufacturer.name, car.manufacturer.country, car.manufacturer._id);
          CarsObj.push(new Car(
            car.startnumber,
            car.year,
            car.driver.firstname + ' ' + car.driver.lastname,
            car.codriver.firstname + ' ' + car.codriver.lastname,
            car.manufacturer.name,
            car._id,
            driverobj,
            codriverobj,
            manufacturerobj,
            ),
          )
          ;
        }
        return CarsObj;
      })
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  getRallyCar(id: string) {
    return this.http.get('http://localhost:3000/data/rallycar/' + id)
      .map((response: Response) => {
        const cars = response.json().obj;
        const CarsObj: Rallycar[] = [];
        for (const car of cars) {
          const driverobj = new Driver(car.car.driver.firstname, car.car.driver.lastname, car.car.driver.country, car.car.driver._id);
          const codriverobj = new Codriver(
            car.car.codriver.firstname,
            car.car.codriver.lastname,
            car.car.codriver.country,
            car.car.codriver._id,
          );
          const manufacturerobj = new Manufacturer(car.car.manufacturer.name, car.car.manufacturer.country, car.car.manufacturer._id);
          const carobj = new Car(
            car.car.startnumber,
            car.car.year,
            car.car.driver._id,
            car.car.codriver._id,
            car.car.manufacturer._id,
            car.car._id,
            driverobj,
            codriverobj,
            manufacturerobj,
          );
          const rallyobj = new Rally(car.rally.name, car.rally.country, car.rally.startdate, car.rally.enddate, car.rally._id);
          const rallycarobj = new Rallycar(
            car.car.startnumber,
            car.rally.name,
            car.car._id,
            car._id,
            carobj,
            rallyobj,
          );
          CarsObj.push(rallycarobj);
        }
        return CarsObj;
      })
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  getStagetime(id: string) {
    return this.http.get('http://localhost:3000/data/stagetimes/' + id)
      .map((response: Response) => {
        const stagetimes = response.json().obj;
        const StagetimesObj: Stagetime[] = [];
        for (const stagetime of stagetimes) {
          const driverobj = new Driver(
            stagetime.driver.firstname,
            stagetime.driver.lastname,
            stagetime.driver.country,
            stagetime.driver._id,
          );
          const codriverobj = new Codriver(
            stagetime.codriver.firstname,
            stagetime.codriver.lastname,
            stagetime.codriver.country,
            stagetime.codriver._id,
          );
          const manufacturerobj = new Manufacturer(
            stagetime.manufacturer.name,
            stagetime.manufacturer.country,
            stagetime.manufacturer._id,
          );
          const carobj = new Car(
            stagetime.car.startnumber,
            stagetime.car.year,
            stagetime.car.driver,
            stagetime.car.codriver,
            stagetime.car.manufacturer,
            stagetime.car._id,
          );
          const rallyobj = new Rally(
            stagetime.rally.name,
            stagetime.rally.country,
            stagetime.rally.startdate,
            stagetime.rally.enddate,
            stagetime.rally._id,
          );
          const stageobj = new Stage(
            stagetime.stage.name,
            stagetime.stage.day,
            stagetime.stage.date,
            stagetime.stage.cancelled,
            stagetime.stage.powerstage,
            stagetime.stage.stagenumber,
            stagetime.stage.meter,
            stagetime.stage.rally,
          );
          const stagetimeobj = new Stagetime(
            stageobj.name,
            rallyobj.name,
            carobj.startnumber + '',
            stagetime.time,
            stagetime.position,
            manufacturerobj.name,
            driverobj.lastname,
            codriverobj.lastname,
            stagetime._id,
            stageobj,
            rallyobj,
            carobj,
            manufacturerobj,
            driverobj,
            codriverobj,
          );
          StagetimesObj.push(stagetimeobj);
        }
        return StagetimesObj;
      })
      .catch((error: Response) => {
        this.notificationService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }
}
