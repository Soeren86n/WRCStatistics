import { Routes, RouterModule } from '@angular/router';

import { AuthenticationComponent } from './auth/authentication.component';
import { RallystatsComponent } from './rallystats/rallystats.component';

const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'admin', component: AuthenticationComponent, loadChildren: './auth/auth.module#AuthModule' },
  { path: 'stats', component: RallystatsComponent, loadChildren: './rallystats/rallystats.module#RallystatsModule' },
];

export const routing = RouterModule.forRoot(APP_ROUTES);
