import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, switchMap, take } from 'rxjs';
import { environment } from 'src/environments/environments';
import * as ReviewsActions from './reviews.actions';
import * as Utils from '../../shared/utils';

import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { MovieDetails, movieInfo } from 'src/app/shared/movie-info.model';
import { movieReview, movieReviews } from '../review.model';

const tmdbURL = 'https://api.themoviedb.org/3';
const firebaseURL = 'https://tyager-angular-practice-app-default-rtdb.firebaseio.com'

@Injectable()
export class ReviewsEffects {

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState> ) {}

    fetchUserWatchlist = createEffect(() => this.actions$.pipe(
        ofType(ReviewsActions.FETCH_USER_REVIEW_DATA),
        switchMap((userId: ReviewsActions.FetchUserReviewData) => {
            return this.http.get<{ [key: string]: movieReviews }>
            (`${firebaseURL}/users/${userId.payload}/userReviews.json`)
            .pipe(map((resData) => {
                if (!resData) {
                    return null;
                } else {
                    console.log(resData);
                    console.log(Object.values(resData));
                    return new ReviewsActions.LoadUserReviewData(Object.values(resData));
                }
            }))
        })
    ));

    addUserReview = createEffect(() => this.actions$.pipe(
        ofType(ReviewsActions.ADD_REVIEW),
        map((review: ReviewsActions.AddReview) => {
            return this.store.select('auth').pipe(take(1)).subscribe((userAuthData) => {
                const movieId = review.payload.movieInfo.movieDetails.id;
                return this.http.get<movieReviews>
                (`${firebaseURL}/users/${userAuthData.user.id}/userReviews/${movieId}.json`).subscribe((resData) => {
                    if (resData) {
                        return this.http.patch(`${firebaseURL}/users/${userAuthData.user.id}/userReviews/${movieId}.json`, {
                            reviews: [ ...resData.reviews, review.payload.review ]
                                .sort((a, b) => { return (a.watchDate < b.watchDate ? 1 : -1); })
                        }).subscribe();
                    } else {
                        return this.http.put(`${firebaseURL}/users/${userAuthData.user.id}/userReviews/${movieId}.json`, { 
                            movieDetails: review.payload.movieInfo.movieDetails,
                            reviews:  [review.payload.review]
                        }).subscribe();
                    }
                })
            });
        })
    ), { dispatch: false });

    editUserReview = createEffect(() => this.actions$.pipe(
        ofType(ReviewsActions.EDIT_REVIEW),
        map((editedReview: ReviewsActions.EditReview) => { 
            return this.store.select('auth').pipe(take(1)).subscribe((userAuthData) => {
                const movieId = editedReview.payload.movieInfo.movieDetails.id;
                return this.http.patch(`${firebaseURL}/users/${userAuthData.user.id}/userReviews/${movieId}/reviews.json`, {
                    [editedReview.payload.index]: editedReview.payload.review
                }).subscribe(() => {
                    return this.http.get<movieReviews>
                    (`${firebaseURL}/users/${userAuthData.user.id}/userReviews/${movieId}.json`).subscribe((resData) => {
                        return this.http.patch(`${firebaseURL}/users/${userAuthData.user.id}/userReviews/${movieId}.json`, {
                            reviews: [...resData.reviews].sort((a, b) => { return (a.watchDate < b.watchDate ? 1 : -1); })
                        }).pipe(take(1)).subscribe();
                    })
                });
            });
        })
    ), { dispatch: false });

    deleteUserReview = createEffect(() => this.actions$.pipe(
        ofType(ReviewsActions.REMOVE_REVIEW),
        map((deletedReview: ReviewsActions.RemoveReview) => {
            return this.store.select('auth').pipe(take(1)).subscribe((userAuthData) => {
                const movieId = deletedReview.payload.movieInfo.movieDetails.id;
                return this.http.get<movieReview[]>
                (`${firebaseURL}/users/${userAuthData.user.id}/userReviews/${movieId}/reviews.json`)
                .subscribe((resData) => {
                    const newReviews = resData.filter(( el, index )=> index !== deletedReview.payload.index);
                    if (newReviews.length === 0) {
                        return this.http.delete(`${firebaseURL}/users/${userAuthData.user.id}/userReviews/${movieId}.json`).subscribe();
                    } else {
                        return this.http.patch(`${firebaseURL}/users/${userAuthData.user.id}/userReviews/${movieId}.json`, 
                        { reviews: newReviews }).subscribe();
                    }
                })
            });
        })
    ), { dispatch: false })

}
