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
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;

  userData: User | null;

  loggedIn = false;
  loginMode: "Sign Up" | "Login" | null = null;
  error: string | null;

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
      this.error = userAuthData.authError;
    })
  }

  getErrorMessage(control: string) {
    switch(control) {
      case 'email':
        if (this.userAuthForm.controls['email'].hasError('required')) {
          return 'Email required';
        } else { return this.userAuthForm.controls['email'].hasError('email') ? 'Not a valid email' : ''; }
      case 'password':
        if (this.userAuthForm.controls['password'].hasError('required')){
          return 'Password required'
        } else { return this.userAuthForm.controls['password'].hasError('minlength') ? 'Must be at least 6 characters' : ''; }
      default:
        return ''
    }
  }

  switchToSignUp() {
    this.loginMode = "Sign Up";
  }

  switchToLogin() {
    this.loginMode = "Login";
  }

  goBack() {
    this.loginMode = null;
    this.userAuthForm.reset();
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    this.loginMode = null;
    this.userAuthForm.reset();
  }

  onSubmit() {
    console.log(this.userAuthForm.value);
    console.log(this.userAuthForm.valid);
    if (!this.userAuthForm.valid){
      return;
    }
    if (this.loginMode === 'Sign Up') { 
      this.store.dispatch(new AuthActions.InitiateSignUp(this.userAuthForm.value)); 
    } else { 
      this.store.dispatch(new AuthActions.InitiateLogin(this.userAuthForm.value)); 
    }
  }

  onAcknowledgeError(){
    this.store.dispatch(new AuthActions.HandleError());
    this.userAuthForm.controls['password'].reset();
    // After acknowledging error, when user goes back to input and enters a character, 
    // the user receives an error message even if you haven't clicked out of the input
    // This is because mat-error reads the ng-submitted class in the form element
    this.userAuthForm.controls['password'].setErrors(null);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
