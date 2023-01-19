import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  loggedIn = false;
  loginMode: "Sign Up" | "Login" | null = null;

  switchToSignUp() {
    this.loginMode = "Sign Up";
  }

  switchToLogin() {
    this.loginMode = "Login";
  }

  goBack() {
    this.loginMode = null;
  }

}
