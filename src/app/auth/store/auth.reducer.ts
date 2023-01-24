import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
    user: User;
    authError: string;
    loading: boolean;
    loggedIn: boolean;
}

const initState: State = {
    user: null,
    authError: null,
    loading: false,
    loggedIn: false
};

export function authReducer(state: State = initState, action: AuthActions.AuthActions) {
    switch (action.type) {
        case AuthActions.BEGIN_LOGIN:
        case AuthActions.BEGIN_SIGNUP:
            return {
                ...state,
                authError: null,
                loading: true
            };
        case AuthActions.LOGIN:
        case AuthActions.SIGNUP:
            const user = new User(
                action.payload.email, 
                action.payload.userId, 
                action.payload.token, 
                action.payload.expirationDate
            );
            return {
                ...state,
                authError: null,
                user: user,
                loggedIn: true,
                loading: false
            };
        case AuthActions.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            }
        case AuthActions.HANDLE_ERROR:
            return {
                ...state,
                authError: null
            }
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null,
                loggedIn: false
            }
        default:
            return state;
    }
}
