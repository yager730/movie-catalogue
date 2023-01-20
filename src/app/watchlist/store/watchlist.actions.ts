import { Action } from '@ngrx/store';
import { movieInfo } from 'src/app/shared/movie-info.model';

export const GET_WATCHLIST = '[Watchlist] Get Watchlist';
export const ADD_FILM = '[Watchlist] Add Film to Watchlist';
export const REMOVE_FILM = '[Watchlist] Remove Film from Watchlist';
export const FETCH_USER_WATCHLIST = '[Watchlist] Fetch User Watchlist';
export const LOAD_USER_WATCHLIST = '[Watchlist] Load User Watchlist';
export const SET_USER_WATCHLIST = '[Watchlist] Set User Watchlist';

export class GetUpdatedWatchlist implements Action {
    readonly type = GET_WATCHLIST;
}

export class AddToWatchlist implements Action {
    readonly type = ADD_FILM;
    constructor (public payload: movieInfo) {}
}

export class RemoveFromWatchlist implements Action {
    readonly type = REMOVE_FILM
    constructor (public payload: number) {}
}

export class FetchUserWatchlist implements Action {
    readonly type = FETCH_USER_WATCHLIST;
    // use UUID
    constructor (public payload: string) {}
}

export class LoadUserWatchlist implements Action {
    readonly type = LOAD_USER_WATCHLIST;
    constructor (public payload: movieInfo[]) {}
}

export class SetUserWatchlist implements Action {
    readonly type = SET_USER_WATCHLIST;
    // use UUID
    constructor (public payload: string) {}
}

export type WatchlistActions = 
GetUpdatedWatchlist | AddToWatchlist | RemoveFromWatchlist |
FetchUserWatchlist | LoadUserWatchlist | SetUserWatchlist