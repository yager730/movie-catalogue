import { GetSelectedMovieInfo } from "src/app/search/store/search.actions";
import { movieInfo } from "src/app/shared/movie-info.model";
import * as WatchlistActions from "./watchlist.actions";

export interface State {
    films: movieInfo[];
    userWatchlistEmpty: boolean
}

const initState: State = {
    films: [],
    userWatchlistEmpty: null
};

export function watchlistReducer(state: State = initState, action: WatchlistActions.WatchlistActions) {
    switch (action.type) {
        case WatchlistActions.GET_WATCHLIST:
            return {
                ...state
            };
        case WatchlistActions.LOAD_USER_WATCHLIST:
            return {
                ...state,
                films: action.payload
            }
        case WatchlistActions.ADD_FILM:
            return {
                ...state,
                films: [...state.films, action.payload]
            };
        case WatchlistActions.REMOVE_FILM:
            return {
                ...state,
                films: [...state.films.filter(item => item.movieDetails.id !== action.payload)]
            };
        default:
            return state;
    }
}
