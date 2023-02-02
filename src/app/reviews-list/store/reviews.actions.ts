import { Action } from '@ngrx/store';
import { movieInfo } from 'src/app/shared/movie-info.model';
import { movieReview } from '../review.model';

export const ADD_REVIEW    = '[Review] Add Review';
export const EDIT_REVIEW   = '[Review] Edit Review';
export const REMOVE_REVIEW = '[Review] Remove Review';

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

export type ReviewActions = 
AddReview | EditReview | RemoveReview 