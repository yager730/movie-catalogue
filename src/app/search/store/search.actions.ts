import { Action } from "@ngrx/store";
import { SearchResult } from "../search-result.model";

export const MOVIE_SEARCH = '[Search] Search';
export const MOVIE_SEARCH_RESULTS = '[Search] Results';
export const SEARCH_ERROR = '[Search] Search Error';

export class MovieSearch implements Action {
    readonly type = MOVIE_SEARCH;

    constructor(public payload: string) {}
}

export class MovieSearchResults implements Action {
    readonly type = MOVIE_SEARCH_RESULTS;

    constructor(public payload: { results_found: number; results_list: SearchResult[] }) {}
}

export class SearchError implements Action {
    readonly type = SEARCH_ERROR;

    constructor(public payload: string) {}
}

export type SearchActions = 
    MovieSearch | MovieSearchResults | SearchError