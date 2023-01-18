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
    movieDataLoading: boolean;
}

const initState: State = {
    searchTerm: null,
    results: null,
    numResults: null,
    selectedMovie: null,
    movieInfo: {
        movieDetails: null,
        movieCrew: null,
        movieImagePaths: null
    },
    apiError: null,
    loading: false,
    movieDataLoading: true
};

export function searchReducer(state: State = initState, action: SearchActions.SearchActions) {
    switch (action.type) {
        case SearchActions.FETCH_MOVIES:
            return {
                ...state
            };
        case SearchActions.UPDATE_SEARCH_RESULTS_PAGE:
            return {
                ...state,
                results: action.payload
            }
        case SearchActions.UPDATE_SEARCH_TERM:
            return {
                ...state,
                searchTerm: action.payload
            };
        case SearchActions.INITIATE_SEARCH:
            return {
                ...state,
                apiError: null,
                loading: true
            };
        case SearchActions.YIELD_SEARCH_RESULTS:
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
        case SearchActions.SHOW_SEARCH_ERROR:
            return {
                ...state,
                results: null,
                numResults: 0,
                apiError: action.payload,
                loading: false
            }
        case SearchActions.SELECT_MOVIE:
            console.log(state.results);
            return {
                ...state,
                movieDataLoading: true,
                selectedMovie: action.payload
            }
        case SearchActions.GET_SELECTED_MOVIE_INFO:
            return {
                ...state,
                movieDataLoading: false,
                movieInfo: action.payload
            }
        default:
            return state;
    }
}
