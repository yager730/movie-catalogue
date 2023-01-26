import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { forkJoin, map, switchMap, take } from 'rxjs';
import { CrewResponseData, MovieDetailsResponseData, MovieImagesResponseData } from 'src/app/search/store/api-response.interfaces';
import { environment } from 'src/environments/environments';
import * as WatchlistActions from './watchlist.actions';

import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { movieInfo } from 'src/app/shared/movie-info.model';

const tmdbURL = 'https://api.themoviedb.org/3';
const firebaseURL = 'https://tyager-angular-practice-app-default-rtdb.firebaseio.com'

@Injectable()
export class WatchlistEffects {

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState> ) {}

    fetchUserWatchlist = createEffect(() => this.actions$.pipe(
        ofType(WatchlistActions.FETCH_USER_WATCHLIST),
        switchMap((userId: WatchlistActions.FetchUserWatchlist) => {
            return this.http.get<string>(`${firebaseURL}/users/${userId.payload}/watchlist.json`)
            .pipe(map((resData) => {
                if (resData !== "") {
                    let userWatchlistMovies: movieInfo[] = new Array(resData.split(',').length).fill({movieDetails: null, movieCrew: null, movieImagesPaths: null});
                    resData.split(',').forEach((id, index) => {
                        return forkJoin({
                            details: this.http.get<MovieDetailsResponseData>(tmdbURL + '/movie/' + id + 
                                '?api_key=' + environment.TMDB_API_key + '&language=en-US'),
                            crew: this.http.get<CrewResponseData>(tmdbURL + '/movie/' + id + 
                                '/credits?api_key=' + environment.TMDB_API_key + '&language=en-US'),
                            images: this.http.get<MovieImagesResponseData>(tmdbURL + '/movie/' + id + 
                                '/images?api_key=' + environment.TMDB_API_key + '&language=en-US&include_image_language=en%2Cnull') })
                        .pipe(take(1)).subscribe((data) => {
                            const movieInfo = {
                                movieDetails: {
                                    id: data.details.id,
                                    title: data.details.title,
                                    tagline: data.details.tagline,
                                    runtime: data.details.runtime,
                                    release_date: data.details.release_date,
                                    score: data.details.vote_average,
                                    poster: data.details.poster_path ? 'https://image.tmdb.org/t/p/original' + data.details.poster_path : null,
                                    overview: data.details.overview
                                },
                                movieCrew: { cast: data.crew.cast, crew: data.crew.crew },
                                movieImagePaths: data.images.backdrops.map((backdrop) => 'https://image.tmdb.org/t/p/original' + backdrop.file_path)
                            };
                            console.log(`movieInfo loaded for ${movieInfo.movieDetails.id}: ${movieInfo.movieDetails.title}`)
                            userWatchlistMovies = [...userWatchlistMovies];
                            userWatchlistMovies[index] = movieInfo;

                            if (userWatchlistMovies.filter(obj => obj.movieDetails !== null ).length > 0) 
                                { this.store.dispatch(new WatchlistActions.LoadUserWatchlist(userWatchlistMovies)) } 
                        })
                    });
                }
            }))
        })
    ), {dispatch: false});

    addToUserWatchlist = createEffect(() => this.actions$.pipe(
        ofType(WatchlistActions.ADD_FILM),
        map((filmData: WatchlistActions.AddToWatchlist) => {
            console.log('Add to user watchlist effect called!');
            return this.store.select('auth').pipe(take(1)).subscribe((userAuthData) => {
                return this.http.get<string>(`${firebaseURL}/users/${userAuthData.user.id}/watchlist.json`).subscribe((resData) => {
                    console.log('Adding movie to user watchlist:')
                    const movieId = filmData.payload.movieDetails.id.toString();
                    console.log(movieId);
                    if (resData !== "") {
                        console.log('Appending movie to watchlist...');
                        const newData = (resData.split(',').concat(movieId)).join(',');
                        console.log('new watchlist: ')
                        console.log(newData)
                        return this.http.put(`${firebaseURL}/users/${userAuthData.user.id}.json`, { watchlist: newData }).subscribe();
                    } else {
                        return this.http.put(`${firebaseURL}/users/${userAuthData.user.id}.json`, { watchlist: movieId }).subscribe();
                    }
                })
            });
        })
    ), { dispatch: false });

    removeFromUserWatchlist = createEffect(() => this.actions$.pipe(
        ofType(WatchlistActions.REMOVE_FILM),
        map((filmData: WatchlistActions.RemoveFromWatchlist) => {
            console.log('Remove from user watchlist effect called!');
            return this.store.select('auth').pipe(take(1)).subscribe((userAuthData) => {
                return this.http.get<string>(`${firebaseURL}/users/${userAuthData.user.id}/watchlist.json`).subscribe((resData) => {
                    console.log('Removing movie from user watchlist:')
                    const movieId = filmData.payload.toString();
                    console.log(movieId);
                    const newData = resData.split(',').filter(el => el !== movieId).join(',');
                    return this.http.put(`${firebaseURL}/users/${userAuthData.user.id}.json`, { watchlist: newData }).subscribe();
                })
            });
        })
    ), { dispatch: false });

}
