import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, of, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environments';

import * as AuthActions from './auth.actions';
import { User } from '../user.model';
import { AuthService, AuthResponseData } from '../auth.service';
import * as WatchlistActions from '../../watchlist/store/watchlist.actions';
import * as ReviewsActions from '../../reviews-list/store/reviews.actions';

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string, newUser: boolean = false) => {
    const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    console.log('Handling auth...')
    if (newUser) {
        return new AuthActions.Signup({
            email: email,
            userId: userId,
            token: token,
            expirationDate: expirationDate,
            redirect: true
        })
    } else {
        return new AuthActions.Login({
            email: email,
            userId: userId,
            token: token,
            expirationDate: expirationDate,
            redirect: true
        });
    }
};

const handleError = (errorResponse: any) => {
    let errorMessage = 'An unkown error has occurred';
    if (!errorResponse.error || !errorResponse.error.error) {
        return of(new AuthActions.LoginFailure(errorMessage));
    }
    switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'An account with this email exists already. Please sign-up with a unique email.';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'An account with this email does not exist.'
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'Incorrect password.'
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
            .post<AuthResponseData>(environment.Auth_Base_URL + '/v1/accounts:signUp?key=' + environment.Auth_API_key, 
            {
                email: signupInfo.payload.email,
                password: signupInfo.payload.password,
                returnSecureToken: true
            })
            .pipe(
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                }),
                map(resData => {
                    return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken, true);
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
            .post<AuthResponseData>(environment.Auth_Base_URL + '/v1/accounts:signInWithPassword?key=' + environment.Auth_API_key, 
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

    autoLogin = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.AUTO_LOGIN),
            map(() => {
                const userData: {
                    email: string;
                    id: string;
                    _token: string;
                    _tokenExpirationDate: string;
                } = JSON.parse(localStorage.getItem('userData'));
        
                if (!userData) {
                    return { type: 'nothing' };
                }
                const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        
                if (loadedUser.token) {
                    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                    this.authService.setLogoutTimer(expirationDuration);
                    return new AuthActions.Login({
                        email: loadedUser.email, 
                        userId: loadedUser.id, 
                        token: loadedUser.token, 
                        expirationDate: new Date(userData._tokenExpirationDate),
                        redirect: false
                    });
                }
                return { type: 'nothing' }; 
            })
        )
    })

    getUserWatchlistOnLogin = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        map((loginInfo: AuthActions.Login) => {            
            console.log('Fetching user watchlist data...');
            return new WatchlistActions.FetchUserWatchlist(loginInfo.payload.userId);
        })
    ));

    getUserReviewsOnLogin = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        map((loginInfo: AuthActions.Login) => {            
            console.log('Fetching user review data...');
            return new ReviewsActions.FetchUserReviewData(loginInfo.payload.userId);
        })
    ));

    initiatlizeUserData = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.SIGNUP),
        map((loginInfo: AuthActions.Signup) => {
            this.http.put(environment.Firebase_Base_URL + `/users/${loginInfo.payload.userId}.json`, 
                { 'watchlist': '' }).pipe(take(1)).subscribe(() => console.log('Finished initializing watchlist!'));
        })
    ), {dispatch: false});

    clearWatchlistOnLogout = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        map(() => {
            location.reload();
            console.log('User logging out. Clearing user watchlist data');
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            return new WatchlistActions.ClearWatchlist();
        })
    ));
}
