import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar.component';
import { SidebarComponent } from './sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationComponent } from './auth/authentication.component';
import { routing } from './app.routing';
import { HttpModule } from '@angular/http';
import { AuthService } from './auth/auth.service';
import { NotificationService } from './shared/notification.service';
import { ConfirmationService, ConfirmDialogModule, GrowlModule } from 'primeng/primeng';
import { ErrorComponent } from './shared/error.component';
import { GetdataService } from './shared/getdata.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    AuthenticationComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    routing,
    HttpModule,
    GrowlModule,
    ConfirmDialogModule,
  ],
  providers: [
    AuthService,
    NotificationService,
    GetdataService,
    ConfirmationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

}
