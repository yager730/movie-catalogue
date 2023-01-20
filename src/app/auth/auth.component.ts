import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';
import { User } from './user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;

  userData: User | null;

  loggedIn = false;
  loginMode: "Sign Up" | "Login" | null = null;

  userAuthForm: FormGroup;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.userAuthForm = new FormGroup ({
      email: new FormControl(),
      password: new FormControl()
    });
    this.userSubscription = this.store.select('auth')
    .subscribe(userAuthData => {
      this.userData = userAuthData.user;
      this.loggedIn = userAuthData.loggedIn;
    })
  }

  switchToSignUp() {
    this.loginMode = "Sign Up";
  }

  switchToLogin() {
    this.loginMode = "Login";
  }

  goBack() {
    this.loginMode = null;
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    this.loginMode = null;
  }

  onSubmit() {
    console.log(this.userAuthForm.value);
    if (this.loginMode === 'Sign Up') { 
      this.store.dispatch(new AuthActions.InitiateSignUp(this.userAuthForm.value)); 
    } else { 
      this.store.dispatch(new AuthActions.InitiateLogin(this.userAuthForm.value)); 
    }
    this.userAuthForm.reset();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
