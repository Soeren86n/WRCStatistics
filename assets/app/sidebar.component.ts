import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'my-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  navMobileCollapse = true;

  constructor(public authService: AuthService) {}
}
