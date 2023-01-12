import { Action } from '@ngrx/store';
import { movieInfo } from 'src/app/shared/movie-info.model';

export const GET_WATCHLIST = '[Watchlist] Get Watchlist'
export const ADD_FILM = '[Watchlist] Add Film to Watchlist';
export const REMOVE_FILM = '[Watchlist] Remove Film from Watchlist';

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

export type WatchlistActions = 
GetUpdatedWatchlist | AddToWatchlist | RemoveFromWatchlist