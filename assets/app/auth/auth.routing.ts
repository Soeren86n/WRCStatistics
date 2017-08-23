import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './signup.component';
import { SigninComponent } from './signin.component';
import { LogoutComponent } from './logout.component';
import { InsertCountryComponent } from './insertdata/insert-country.component';

const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'insertcountry', component: InsertCountryComponent },
];

export const authRouting = RouterModule.forChild(AUTH_ROUTES);
