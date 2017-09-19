import { Routes, RouterModule } from '@angular/router';
import { CurrentPositionhistoryComponent } from './current-positionhistory.component';
import { MeterdifferenceComponent } from './meterdifference.component';
import { StagewinsComponent } from './stagewins.component';


const RALLYSTATS_ROUTES: Routes = [
  { path: '', redirectTo: 'currentpositionhistory', pathMatch: 'full' },
  { path: 'currentpositionhistory', component: CurrentPositionhistoryComponent },
  { path: 'meterdifference', component: MeterdifferenceComponent },
  { path: 'stagewins', component: StagewinsComponent },
];

export const rallystatRouting = RouterModule.forChild(RALLYSTATS_ROUTES);
