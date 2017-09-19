import { NgModule } from '@angular/core';
import { rallystatRouting } from './rallystats.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartModule, DropdownModule, MultiSelectModule, SharedModule } from 'primeng/primeng';
import { CurrentPositionhistoryComponent } from './current-positionhistory.component';
import { MeterdifferenceComponent } from './meterdifference.component';
import { StagewinsComponent } from './stagewins.component';


@NgModule({
  declarations: [
    CurrentPositionhistoryComponent,
    MeterdifferenceComponent,
    StagewinsComponent,
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
  ],
  providers: [
  ],
})
export class RallystatsModule {

}
