import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: []
})
export class SignInComponent {
  email: string
  password: string

  constructor(
    public authService: AuthService
  ) { }

  signIn() {
    this.authService.signIn(this.email, this.password)
  }

}
