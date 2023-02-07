import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, take } from 'rxjs';
import { environment } from 'src/environments/environments';
import * as ReviewsActions from './reviews.actions';

import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { movieInfo } from 'src/app/shared/movie-info.model';
import { movieReviews } from '../review.model';

const tmdbURL = 'https://api.themoviedb.org/3';
const firebaseURL = 'https://tyager-angular-practice-app-default-rtdb.firebaseio.com'

@Injectable()
export class ReviewsEffects {

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState> ) {}

    updateUserReviews = createEffect(() => this.actions$.pipe(
        ofType(ReviewsActions.ADD_REVIEW),
        map(() => {
            console.log('Update to user reviews log!');
            return this.store.select('reviews').pipe(take(1)).subscribe((reviewsData) => {
                console.log(reviewsData.reviewsList)
                let body;
                for (let item of reviewsData.reviewsList) {
                    body = {...body, [item.movieDetails.id] : item }
                }
                return this.store.select('auth').pipe(take(1)).subscribe((userAuthData) => {
                    return this.http.put(`${firebaseURL}/users/${userAuthData.user.id}/userReviews.json`, body).subscribe();
                });
            });
        })
    ), { dispatch: false });

}