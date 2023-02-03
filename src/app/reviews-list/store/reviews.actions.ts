import { Action } from '@ngrx/store';
import { movieInfo } from 'src/app/shared/movie-info.model';
import { movieReview } from '../review.model';

export const ADD_REVIEW    = '[Review] Add Review';
export const EDIT_REVIEW   = '[Review] Edit Review';
export const REMOVE_REVIEW = '[Review] Remove Review';
export const LOAD_MOVIE    = '[Review] Loading Movie Info';
export const MOVIE_LOADED  = '[Review] Movie Info Loaded';

export class AddReview implements Action {
    readonly type = ADD_REVIEW;
    constructor (public payload: { movieInfo: movieInfo, review: movieReview }) {}
}

export class EditReview implements Action {
    readonly type = EDIT_REVIEW;
    constructor (public payload: { movieInfo: movieInfo, index: number, review: movieReview }) {}
}

export class RemoveReview implements Action {
    readonly type = REMOVE_REVIEW;
    constructor (public payload: { movieInfo: movieInfo, index: number }) {}
}

export class LoadMovieInfo implements Action {
    readonly type = LOAD_MOVIE;
}

export class MovieInfoLoaded implements Action {
    readonly type = MOVIE_LOADED;
}

export type ReviewActions = 
AddReview | EditReview | RemoveReview |
LoadMovieInfo | MovieInfoLoaded