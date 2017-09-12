import { Routes, RouterModule } from '@angular/router';
import { CurrentPositionhistoryComponent } from './current-positionhistory.component';


const RALLYSTATS_ROUTES: Routes = [
  { path: '', redirectTo: 'currentpositionhistory', pathMatch: 'full' },
  { path: 'currentpositionhistory', component: CurrentPositionhistoryComponent },
];

export const rallystatRouting = RouterModule.forChild(RALLYSTATS_ROUTES);
