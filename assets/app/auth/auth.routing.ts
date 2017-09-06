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
];

export const authRouting = RouterModule.forChild(AUTH_ROUTES);
