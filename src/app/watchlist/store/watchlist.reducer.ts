import { SearchResult } from "src/app/search/search-result.model";
import * as WatchlistActions from "./watchlist.actions";

export interface AppState {
    shoppingList: State;
}

export interface State {
    films: SearchResult[];
    editedIngredientIndex: number;
}

const initState: State = {
    films: [],
    editedIngredientIndex: -1
};

export function watchlistReducer(state: State = initState, action: WatchlistActions.WatchlistActions) {
    switch (action.type) {
        case WatchlistActions.GET_WATCHLIST:
            return {
                ...state
            };
        case WatchlistActions.ADD_FILM:
            return {
                ...state,
                films: [...state.films, action.payload]
            };
        case WatchlistActions.REMOVE_FILM:
            return {
                ...state
            };
        default:
            return state;
    }
}
