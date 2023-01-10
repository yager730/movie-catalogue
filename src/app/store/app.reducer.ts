import * as fromSearch from '../search/store/search.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
    search: fromSearch.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    search: fromSearch.searchReducer
};
