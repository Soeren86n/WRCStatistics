import { Routes, RouterModule } from '@angular/router';

import { AuthenticationComponent } from './auth/authentication.component';

const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'auth', component: AuthenticationComponent, loadChildren: './auth/auth.module#AuthModule' },
];

export const routing = RouterModule.forRoot(APP_ROUTES);
