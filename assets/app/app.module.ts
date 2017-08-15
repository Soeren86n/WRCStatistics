import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar.component';
import { SidebarComponent } from './sidebar.component';

@NgModule({
  declarations: [AppComponent, NavbarComponent, SidebarComponent],
  imports: [NgbModule.forRoot(), BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {

}
