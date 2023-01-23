import { Action } from '@ngrx/store';

// export const AUTO_LOGIN = '[Auth] Auto Login';
export const BEGIN_LOGIN = '[Auth] Begin Login';
export const BEGIN_SIGNUP = '[Auth] Begin Signup';
// export const HANDLE_ERROR = '[Auth] Handle Error';
export const LOGIN = '[Auth] Login';
export const LOGIN_FAILURE = '[Auth] Login Failure';
export const LOGOUT = '[Auth] Logout';

export class InitiateLogin implements Action {
    readonly type = BEGIN_LOGIN;
    constructor(public payload: { email: string; password: string }) {}
}

export class InitiateSignUp implements Action {
    readonly type = BEGIN_SIGNUP;
    constructor(public payload: { email: string; password: string }) {}
}

export class Login implements Action {
    readonly type = LOGIN;
    constructor(public payload: {
        email: string, 
        userId: string; 
        token: string; 
        expirationDate: Date;
        redirect: boolean;
    }) {}
}

export class LoginFailure implements Action {
    readonly type = LOGIN_FAILURE;
    constructor(public payload: string) {}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export type AuthActions = 
    InitiateLogin | InitiateSignUp |
    Login | LoginFailure | Logout
    