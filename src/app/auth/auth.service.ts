import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from '@firebase/auth-types';
import { SignUp } from '../sign-up/model/sign-up';

export interface UserData {
  displayName: string
  email: string
  uid: string
  emailVerified: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  UserData: User | null

  constructor(
    private auth: AngularFireAuth,
    private router: Router
  ) { 
    auth.onAuthStateChanged((user: any)=>{
      if (user){
        this.UserData = user
        localStorage.setItem('user', JSON.stringify(this.UserData))
        JSON.parse(localStorage.getItem('user')!)
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!)
      }
    })
  }

  signUp(signUpData: SignUp) {
    console.log(signUpData)
    this.auth.createUserWithEmailAndPassword(signUpData.email, signUpData.password)
      .then((response) => {
        this.UserData = response.user
        response.user?.updateProfile({
          displayName: signUpData.displayName
        })
          .then(() => {
            this.router.navigate(['/dashboard'])
          })
      })
      .catch((error) => {
        alert(error)
      })
  }

  signIn(email: string, password: string) {
    console.log(email, password)
    this.auth.signInWithEmailAndPassword(email, password)
      .then((response) => {
        this.UserData = response.user
        this.router.navigate(['/training-programs'])
      })
      .catch((error) => {
        alert(error)
      })
  }
  
  signOut() {
    this.auth.signOut()
      .then(() => { 
        this.router.navigate(['/sign-in'])
      })
  }

  get isLoggedIn(): boolean {
    const token = localStorage.getItem('user')
    const user = JSON.parse(token as string) as User
    return user !== null ? true : false;
  }

  get userInLocalStorage(): User {
    const token = localStorage.getItem('user')
    const user = JSON.parse(token as string) as User
    return user
  }

  getAuthFire(){
    this.auth.currentUser.then(user => {
      return user
    })
  }

}
