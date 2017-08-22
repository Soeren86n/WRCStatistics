import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-authentication',
  template: `
      <router-outlet></router-outlet>
  `,
})
export class AuthenticationComponent {
  constructor(private authService: AuthService) {
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
