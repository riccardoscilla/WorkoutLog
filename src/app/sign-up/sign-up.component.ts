import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SignUp } from './model/sign-up';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: []
})
export class SignUpComponent implements OnInit {

  signUpData: SignUp = new SignUp()

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {}

  signUp() {
    if (!this.signUpData.isValid())
      return
    this.authService.signUp(this.signUpData)
  }
} 