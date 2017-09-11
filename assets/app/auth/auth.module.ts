import { NgModule } from '@angular/core';
import { SignupComponent } from './signup.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { authRouting } from './auth.routing';
import { SigninComponent } from './signin.component';
import { LogoutComponent } from './logout.component';
import { InsertCountryComponent } from './insertdata/insert-country.component';
import { InsertService } from './insertdata/insert-service';
import {
  ConfirmDialogModule, DataListModule, DataTableModule, DropdownModule, MultiSelectModule,
  SharedModule
} from 'primeng/primeng';
import { InsertRallyComponent } from './insertdata/insert-rally.component';
import { InsertStageComponent } from './insertdata/insert-stage.component';
import { InsertManufacturerComponent } from './insertdata/insert-manufacturer.component';
import { InsertDriverComponent } from './insertdata/insert-driver.component';
import { InsertCodriverComponent } from './insertdata/insert-codriver.component';
import { InsertCarComponent } from './insertdata/insert-car.component';
import { InsertStagetimeComponent } from './insertdata/insert-stagetime.component';
import { InsertRallycarsComponent } from './insertdata/insert-rallycars.component';

@NgModule({
  declarations: [
    SignupComponent,
    SigninComponent,
    LogoutComponent,
    InsertCountryComponent,
    InsertRallyComponent,
    InsertStageComponent,
    InsertManufacturerComponent,
    InsertDriverComponent,
    InsertCodriverComponent,
    InsertCarComponent,
    InsertStagetimeComponent,
    InsertRallycarsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    authRouting,
    DataListModule,
    DropdownModule,
    DataTableModule,
    ConfirmDialogModule,
    SharedModule,
    MultiSelectModule,
  ],
  providers: [
    InsertService,
  ],
})
export class AuthModule {

}
