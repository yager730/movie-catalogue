import { MovieDetails } from "../movie-data.model";
import { SearchResult } from "../search-result.model";
import * as SearchActions from "./search.actions";

export interface State {
    results: SearchResult [];
    numResults: number;
    selectedMovie: number;
    movieDetails: MovieDetails | null;
    apiError: string;
    loading: boolean;
}

const initState: State = {
    results: null,
    numResults: 0,
    selectedMovie: null,
    movieDetails: null,
    apiError: null,
    loading: false
};

export function searchReducer(state: State = initState, action: SearchActions.SearchActions) {
    switch (action.type) {
        case SearchActions.MOVIE_SEARCH:
            return {
                ...state,
                apiError: null,
                loading: true
            };
        case SearchActions.MOVIE_SEARCH_RESULTS:
            return {
                ...state,
                results: action.payload.results_list,
                numResults: action.payload.results_found,
                apiError: null,
                loading: false
            };
        case SearchActions.SEARCH_ERROR:
            return {
                ...state,
                results: null,
                numResults: 0,
                apiError: action.payload,
                loading: false
            }
        case SearchActions.MOVIE_SELECT:
            return {
                ...state,
                selectedMovie: action.payload
            }
        case SearchActions.MOVIE_SELECT_DETAILS:
            console.log(action.payload);
            return {
                ...state,
                movieDetails: action.payload
            }
        default:
            return state;
    }
}
