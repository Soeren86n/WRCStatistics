import { NgModule } from '@angular/core';
import { SignupComponent } from './signup.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { authRouting } from './auth.routing';
import { SigninComponent } from './signin.component';
import { LogoutComponent } from './logout.component';
import { InsertCountryComponent } from './insertdata/insert-country.component';
import { InsertService } from './insertdata/insert-service';
import { DataListModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    SignupComponent,
    SigninComponent,
    LogoutComponent,
    InsertCountryComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    authRouting,
    DataListModule,
  ],
  providers: [
    InsertService,
  ],
})
export class AuthModule {

}
