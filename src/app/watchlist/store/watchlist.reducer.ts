import { movieInfo } from "src/app/shared/movie-info.model";
import * as WatchlistActions from "./watchlist.actions";

export interface State {
    films: movieInfo[];
    loadingFilmsFromFirebase: boolean;
    loadingPage: boolean,
    firstDisplayedFilmIndex: number;
    lastDisplayedFilmIndex: number;
}

const initState: State = {
    films: [],
    loadingFilmsFromFirebase: false,
    loadingPage: false,
    firstDisplayedFilmIndex: 0,
    lastDisplayedFilmIndex: 12
};

export function watchlistReducer(state: State = initState, action: WatchlistActions.WatchlistActions) {
    switch (action.type) {
        case WatchlistActions.GET_WATCHLIST:
            return {
                ...state
            };
        case WatchlistActions.FETCH_USER_WATCHLIST:
            return {
                ...state,
                loadingFilmsFromFirebase: true
            }
        case WatchlistActions.LOAD_USER_WATCHLIST:
            return {
                ...state,
                films: action.payload,
                loadingFilmsFromFirebase: false
            }
        case WatchlistActions.GET_WATCHLIST_SLICE:
            return {
                ...state,
                firstDisplayedFilmIndex: action.payload.fromIndex,
                lastDisplayedFilmIndex: action.payload.untilIndex,
                loadingPage: true
            }
        case WatchlistActions.CLEAR_WATCHLIST:
            return {
                ...state,
                films: [],
                firstDisplayedFilmIndex: 0,
                lastDisplayedFilmIndex: 12
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
