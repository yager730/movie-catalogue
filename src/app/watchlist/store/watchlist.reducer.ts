import { movieInfo } from "src/app/shared/movie-info.model";
import * as WatchlistActions from "./watchlist.actions";

export interface State {
    films: movieInfo[];
    selectedFilmIndex: number;
}

const initState: State = {
    films: [],
    selectedFilmIndex: -1
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