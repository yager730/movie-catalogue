import { Action } from "@ngrx/store";
import { movieInfo } from "../../shared/movie-info.model";
import { SearchResult } from "../search-result.model";

export const FETCH_MOVIES = '[Search] Fetch Movies'
export const UPDATE_SEARCH_TERM = '[Search] Update Search Term';
export const INITIATE_SEARCH = '[Search] Initiate Search';
export const YIELD_SEARCH_RESULTS = '[Search] Yield Search Results';
export const VIEW_SEARCH_RESULTS_PAGE = '[Search] View Search Results Page';
export const UPDATE_SEARCH_RESULTS_PAGE = '[Search] Update Search Results Page'
export const SELECT_MOVIE = '[Search] Select Movie';
export const GET_SELECTED_MOVIE_INFO = '[Search] Get Selected Movie Info';
export const SHOW_SEARCH_ERROR = '[Search] Show Search Error';

export class FetchMovies implements Action {
    readonly type = FETCH_MOVIES;
    constructor(public payload: 'top_rated' | 'popular' | 'upcoming') {}
}

export class UpdateSearchTerm implements Action {
    readonly type= UPDATE_SEARCH_TERM;
    constructor(public payload: string) {}
}

export class SearchForTerm implements Action {
    readonly type = INITIATE_SEARCH;
    constructor(public payload: string) {}
}

export class YieldSearchResults implements Action {
    readonly type = YIELD_SEARCH_RESULTS;
    constructor(public payload: { results_found: number; results_list: SearchResult[] }) {}
}

export class DisplaySearchError implements Action {
    readonly type = SHOW_SEARCH_ERROR;
    constructor(public payload: string) {}
}

export class ViewResultsPage implements Action {
    readonly type= VIEW_SEARCH_RESULTS_PAGE;
    constructor(public payload: { page_number: number, search_term: string }) {}
}

export class UpdateSearchResultsPage implements Action {
    readonly type = UPDATE_SEARCH_RESULTS_PAGE;
    constructor(public payload: SearchResult[]) {}
}

export class SelectMovie implements Action {
    readonly type = SELECT_MOVIE;
    constructor(public payload: number) {}
}

export class GetSelectedMovieInfo implements Action {
    readonly type= GET_SELECTED_MOVIE_INFO;
    constructor(public payload: movieInfo) {}
}

export type SearchActions = 
    FetchMovies | 
    SearchForTerm | UpdateSearchTerm |YieldSearchResults | DisplaySearchError |
    ViewResultsPage | UpdateSearchResultsPage |
    SelectMovie | GetSelectedMovieInfo
