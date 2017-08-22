import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
})
export class SigninComponent implements OnInit {
  myForm: FormGroup;

  constructor(private authService: AuthService) {
  }

  onSubmit() {
    const user = new User(
      this.myForm.value.email,
      this.myForm.value.password,
    );
    this.authService.signin(user)
      .subscribe(
        data => console.log(data),
        error => console.error(error),
      );
    this.myForm.reset();
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        // tslint:disable-next-line
        Validators.pattern("[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
        ),
      ]),
      password: new FormControl(null, Validators.required),
    });
  }
}
