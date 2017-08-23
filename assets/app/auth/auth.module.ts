import { NgModule } from '@angular/core';
import { SignupComponent } from './signup.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { authRouting } from './auth.routing';
import { SigninComponent } from './signin.component';
import { LogoutComponent } from './logout.component';
import { InsertCountryComponent } from './insertdata/insert-country.component';

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
  ],
})
export class AuthModule {

}