import * as fromAuth from '../auth/store/auth.reducer';
import * as fromSearch from '../search/store/search.reducer';
import * as fromWatchlist from '../watchlist/store/watchlist.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
    auth: fromAuth.State;
    search: fromSearch.State;
    watchlist: fromWatchlist.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer,
    search: fromSearch.searchReducer,
    watchlist: fromWatchlist.watchlistReducer
};
