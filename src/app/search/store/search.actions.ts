import { Action } from "@ngrx/store";
import { MovieDetails, MovieCrew, MovieImages } from "../movie-data.model";
import { SearchResult } from "../search-result.model";

export const MOVIE_SEARCH = '[Search] Search';
export const MOVIE_SEARCH_RESULTS = '[Search] Search Results';
export const MOVIE_SELECT = '[Search] Select';
export const MOVIE_SELECT_DETAILS = '[Search] Select Details';
export const MOVIE_SELECT_CREW = '[Search] Select Crew';
export const MOVIE_SELECT_IMAGES = '[Search] Select Images';
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
    constructor(public payload: MovieImages) {}
}

export type SearchActions = 
    MovieSearch | MovieSearchResults | SearchError |
    MovieSelect | SelectedMovieDetails | SelectedMovieCrew | SelectedMovieImages
