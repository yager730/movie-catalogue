import { SearchResult } from "../search-result.model";
import * as SearchActions from "./search.actions";

export interface State {
    results: SearchResult [];
    numResults: number;
    apiError: string;
    loading: boolean;
}

const initState: State = {
    results: null,
    numResults: 0,
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
            console.log('got here');
            console.log(action.payload.results_list);
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
        default:
            return state;
    }
}
