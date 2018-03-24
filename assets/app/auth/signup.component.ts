import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  myForm: FormGroup;

  constructor(private authService: AuthService, private notificationService: NotificationService) {}

  onSubmit() {
    const user = new User(this.myForm.value.email, this.myForm.value.password);
    this.authService
      .signup(user)
      .subscribe((data) => this.notificationService.handleError(data.notification), (error) => console.error(error));
    this.myForm.reset();
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,

        Validators.pattern(// tslint:disable-next-line
          "[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
        ),
      ]),
      password: new FormControl(null, Validators.required),
    });
  }
}
