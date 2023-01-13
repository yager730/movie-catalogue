import { movieInfo } from "../../shared/movie-info.model";
import { SearchResult } from "../search-result.model";
import * as SearchActions from "./search.actions";

export interface State {
    searchTerm: string;
    results: SearchResult [];
    numResults: number;
    selectedMovie: number;
    movieInfo: movieInfo;
    apiError: string;
    loading: boolean;
}

const initState: State = {
    searchTerm: null,
    results: null,
    numResults: 0,
    selectedMovie: null,
    movieInfo: {
        movieDetails: null,
        movieCrew: null,
        movieImagePaths: null
    },
    apiError: null,
    loading: false
};

export function searchReducer(state: State = initState, action: SearchActions.SearchActions) {
    switch (action.type) {
        case SearchActions.MOVIE_SEARCH_TERM_UPDATE:
            return {
                ...state,
                searchTerm: action.payload
            };
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
        case SearchActions.VIEW_SEARCH_RESULTS_PAGE:
            return {
                ...state,
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
            console.log(state.results);
            return {
                ...state,
                selectedMovie: action.payload
            }
        case SearchActions.MOVIE_SELECT_DETAILS:
            console.log(action.payload);
            return {
                ...state,
                movieInfo: {
                    ...state.movieInfo,
                    movieDetails: action.payload
                } 
            }
        case SearchActions.MOVIE_SELECT_CREW:
            console.log(action.payload);
            return {
                ...state,
                movieInfo: {
                    ...state.movieInfo,
                    movieCrew: action.payload
                } 
            }
        case SearchActions.MOVIE_SELECT_IMAGES:
            console.log(action.payload);
            return {
                ...state,
                movieInfo: {
                    ...state.movieInfo,
                    movieImagePaths: action.payload
                } 
            }
        default:
            return state;
    }
}
