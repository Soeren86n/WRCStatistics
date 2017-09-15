import { Routes, RouterModule } from '@angular/router';
import { CurrentPositionhistoryComponent } from './current-positionhistory.component';
import { MeterdifferenceComponent } from './meterdifference.component';


const RALLYSTATS_ROUTES: Routes = [
  { path: '', redirectTo: 'currentpositionhistory', pathMatch: 'full' },
  { path: 'currentpositionhistory', component: CurrentPositionhistoryComponent },
  { path: 'meterdifference', component: MeterdifferenceComponent },
];

export const rallystatRouting = RouterModule.forChild(RALLYSTATS_ROUTES);
