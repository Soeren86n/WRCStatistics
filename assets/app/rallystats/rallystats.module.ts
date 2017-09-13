import { NgModule } from '@angular/core';
import { rallystatRouting } from './rallystats.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartModule, DropdownModule, MultiSelectModule, SharedModule } from 'primeng/primeng';
import { CurrentPositionhistoryComponent } from './current-positionhistory.component';


@NgModule({
  declarations: [
    CurrentPositionhistoryComponent,
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
