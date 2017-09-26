import { NgModule } from '@angular/core';
import { rallystatRouting } from './rallystats.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartModule, DropdownModule, MultiSelectModule, SelectButtonModule, SharedModule } from 'primeng/primeng';
import { CurrentPositionhistoryComponent } from './current-positionhistory.component';
import { MeterdifferenceComponent } from './meterdifference.component';
import { StagewinsComponent } from './stagewins.component';
import { RallywinsComponent } from './rallywins.component';
import { CurrentTimedistanceComponent } from './current-timedistance.component';


@NgModule({
  declarations: [
    CurrentPositionhistoryComponent,
    MeterdifferenceComponent,
    StagewinsComponent,
    RallywinsComponent,
    CurrentTimedistanceComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    rallystatRouting,
    SharedModule,
    ChartModule,
    DropdownModule,
    MultiSelectModule,
    SelectButtonModule,
  ],
  providers: [
  ],
})
export class RallystatsModule {

}
