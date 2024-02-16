import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: []
})
export class SignInComponent implements OnInit {
  email: string
  password: string

  constructor(
    public authService: AuthService,
    private messageService: MessageService
  ) { 
    
  }

  ngOnInit(): void {
    this.messageService.clear()
  }

  signIn() {
    this.authService.signIn(this.email, this.password)
  }

  signInAAA() {
    this.email = "a@a.com"
    this.password = "aaaaaa"
    this.signIn()
  }

}
