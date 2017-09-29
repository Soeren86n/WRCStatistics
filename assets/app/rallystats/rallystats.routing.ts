import { Routes, RouterModule } from '@angular/router';
import { CurrentPositionhistoryComponent } from './current-positionhistory.component';
import { MeterdifferenceComponent } from './meterdifference.component';
import { StagewinsComponent } from './stagewins.component';
import { RallywinsComponent } from './rallywins.component';
import { CurrentTimedistanceComponent } from './current-timedistance.component';
import { AvgspeedComponent } from './avgspeed.component';
import { ChampionshippointsComponent } from './championshippoints.component';


const RALLYSTATS_ROUTES: Routes = [
  { path: '', redirectTo: 'currentpositionhistory', pathMatch: 'full' },
  { path: 'currentpositionhistory', component: CurrentPositionhistoryComponent },
  { path: 'meterdifference', component: MeterdifferenceComponent },
  { path: 'stagewins', component: StagewinsComponent },
  { path: 'rallywins', component: RallywinsComponent },
  { path: 'currentimedistance', component: CurrentTimedistanceComponent },
  { path: 'avgspeed', component: AvgspeedComponent },
  { path: 'championshippoints', component: ChampionshippointsComponent },
];

export const rallystatRouting = RouterModule.forChild(RALLYSTATS_ROUTES);
