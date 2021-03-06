import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './signup.component';
import { SigninComponent } from './signin.component';
import { LogoutComponent } from './logout.component';
import { InsertCountryComponent } from './insertdata/insert-country.component';
import { InsertRallyComponent } from './insertdata/insert-rally.component';
import { InsertStageComponent } from './insertdata/insert-stage.component';
import { InsertManufacturerComponent } from './insertdata/insert-manufacturer.component';
import { InsertDriverComponent } from './insertdata/insert-driver.component';
import { InsertCodriverComponent } from './insertdata/insert-codriver.component';
import { InsertCarComponent } from './insertdata/insert-car.component';
import { InsertStagetimeComponent } from './insertdata/insert-stagetime.component';
import { InsertRallycarsComponent } from './insertdata/insert-rallycars.component';
import { InsertOveralltimeComponent } from './insertdata/insert-overalltime.component';
import { InsertCompleterallyStagesComponent } from './insertdata/insert-completerally-stages.component';
import { InsertChampionshippointComponent } from './insertdata/insert-championshippoint.component';

const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'insertcountry', component: InsertCountryComponent },
  { path: 'insertrally', component: InsertRallyComponent },
  { path: 'insertstage', component: InsertStageComponent },
  { path: 'insertmanufacturer', component: InsertManufacturerComponent },
  { path: 'insertdriver', component: InsertDriverComponent },
  { path: 'insertcodriver', component: InsertCodriverComponent },
  { path: 'insertcar', component: InsertCarComponent },
  { path: 'insertstagetime', component: InsertStagetimeComponent },
  { path: 'insertoveralltime', component: InsertOveralltimeComponent },
  { path: 'insertrallycars', component: InsertRallycarsComponent },
  { path: 'insertcompleterallystages', component: InsertCompleterallyStagesComponent },
  { path: 'insertpoints', component: InsertChampionshippointComponent },
];

export const authRouting = RouterModule.forChild(AUTH_ROUTES);
