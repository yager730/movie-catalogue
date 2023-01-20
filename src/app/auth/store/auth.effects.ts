import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environments';

import * as AuthActions from './auth.actions';
import { User } from '../user.model';
import { AuthService, AuthResponseData } from '../auth.service';
import * as WatchlistActions from '../../watchlist/store/watchlist.actions';

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    console.log('Handling auth...')
    return new AuthActions.Login({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
        redirect: true
    });
};

const handleError = (errorResponse: any) => {
    let errorMessage = 'An unkown error has occurred';
    if (!errorResponse.error || !errorResponse.error.error) {
        return of(new AuthActions.LoginFailure(errorMessage));
    }
    switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'An account for this email does not exist'
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'Password incorrect'
            break;
    }
    console.log(errorMessage);
    return of(new AuthActions.LoginFailure(errorMessage));
};

@Injectable()
export class AuthEffects {

    constructor(private actions$: Actions, private http: HttpClient, private authService: AuthService) {}

    authSignup = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.BEGIN_SIGNUP),
        switchMap((signupInfo: AuthActions.InitiateSignUp) => {
            return this.http
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.Auth_API_key, 
            {
                email: signupInfo.payload.email,
                password: signupInfo.payload.password,
                returnSecureToken: true
            })
            .pipe(
                tap(resData => {
                    const setUpUserData = this.http.put(`https://tyager-angular-practice-app-default-rtdb.firebaseio.com/users/${resData.localId}.json`, 
                      { 'watchlist': '' });
                    setUpUserData.subscribe();
                }),
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                }),
                map(resData => {
                    return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
                }), 
                catchError(errorResponse => {
                    return handleError(errorResponse);
                })
            )
        })
    ));

    authLogin = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.BEGIN_LOGIN),
        switchMap((loginInfo: AuthActions.InitiateLogin) => {
            return this.http
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.Auth_API_key, 
            {
                email: loginInfo.payload.email,
                password: loginInfo.payload.password,
                returnSecureToken: true
            })
            .pipe(tap(resData => {
                this.authService.setLogoutTimer(+resData.expiresIn * 1000); 
            }),
            map(resData => {
                return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
            }), 
            catchError(errorResponse => {
                return handleError(errorResponse);
            }))
        })
    ));

    getWatchlist = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        map((loginInfo: AuthActions.Login) => {
            console.log('Fetching user watchlist...')
            return new WatchlistActions.FetchUserWatchlist(loginInfo.payload.userId);
        })
    ));
}
