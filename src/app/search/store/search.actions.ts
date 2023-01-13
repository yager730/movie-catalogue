import { Action } from "@ngrx/store";
import { MovieDetails, MovieCrew } from "../../shared/movie-info.model";
import { SearchResult } from "../search-result.model";

export const MOVIE_SEARCH_TERM_UPDATE = '[Search] Search Term Update';
export const MOVIE_SEARCH = '[Search] Search';
export const MOVIE_SEARCH_RESULTS = '[Search] Search Results';
export const VIEW_SEARCH_RESULTS_PAGE = '[Search] View Search Results Page';
export const MOVIE_SELECT = '[Search] Select';
export const MOVIE_SELECT_DETAILS = '[Search] Select Details';
export const MOVIE_SELECT_CREW = '[Search] Select Crew';
export const MOVIE_SELECT_IMAGES = '[Search] Select Images';
export const SEARCH_ERROR = '[Search] Search Error';

export class UpdateSearchTerm implements Action {
    readonly type= MOVIE_SEARCH_TERM_UPDATE;
    constructor(public payload: string) {}
}

export class MovieSearch implements Action {
    readonly type = MOVIE_SEARCH;
    constructor(public payload: string) {}
}

export class MovieSearchResults implements Action {
    readonly type = MOVIE_SEARCH_RESULTS;
    constructor(public payload: { results_found: number; results_list: SearchResult[] }) {}
}

export class ViewResultsPage implements Action {
    readonly type= VIEW_SEARCH_RESULTS_PAGE;
    constructor(public payload: { page_number: number, search_term: string }) {}
}

export class SearchError implements Action {
    readonly type = SEARCH_ERROR;
    constructor(public payload: string) {}
}

export class MovieSelect implements Action {
    readonly type = MOVIE_SELECT;
    constructor(public payload: number) {}
}

export class SelectedMovieDetails implements Action {
    readonly type = MOVIE_SELECT_DETAILS;
    constructor(public payload: MovieDetails) {}
}

export class SelectedMovieCrew implements Action {
    readonly type = MOVIE_SELECT_CREW;
    constructor(public payload: MovieCrew) {}
}

export class SelectedMovieImages implements Action {
    readonly type = MOVIE_SELECT_IMAGES;
    constructor(public payload: string []) {}
}

export type SearchActions = 
    UpdateSearchTerm | MovieSearch | MovieSearchResults | SearchError | ViewResultsPage |
    MovieSelect | SelectedMovieDetails | SelectedMovieCrew | SelectedMovieImages
