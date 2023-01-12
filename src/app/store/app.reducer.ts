import * as fromSearch from '../search/store/search.reducer';
import * as fromWatchlist from '../watchlist/store/watchlist.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
    search: fromSearch.State;
    watchlist: fromWatchlist.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    search: fromSearch.searchReducer,
    watchlist: fromWatchlist.watchlistReducer
};
