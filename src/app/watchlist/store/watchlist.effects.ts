import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { forkJoin, from, map, of, switchMap, tap } from 'rxjs';
import { CrewResponseData, MovieDetailsResponseData, MovieImagesResponseData } from 'src/app/search/store/api-response.interfaces';
import { movieInfo } from 'src/app/shared/movie-info.model';
import { environment } from 'src/environments/environments';
import * as WatchlistActions from './watchlist.actions';

import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

const baseURL = 'https://api.themoviedb.org/3';

@Injectable()
export class WatchlistEffects {

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState> ) {}

    fetchUserWatchlist = createEffect(() => this.actions$.pipe(
        ofType(WatchlistActions.FETCH_USER_WATCHLIST),
        switchMap((userId: WatchlistActions.FetchUserWatchlist) => {
            console.log('Got here!');
            return this.http.get<string>(`https://tyager-angular-practice-app-default-rtdb.firebaseio.com/users/${userId.payload}/watchlist.json`)
            .pipe(map((resData) => {
                console.log('response: ' + resData.split(','));
                return resData.split(',')
                .map(id => {
                    return forkJoin({
                        details: this.http.get<MovieDetailsResponseData>(baseURL + '/movie/' + id + 
                            '?api_key=' + environment.TMDB_API_key + '&language=en-US'),
                        crew: this.http.get<CrewResponseData>(baseURL + '/movie/' + id + 
                            '/credits?api_key=' + environment.TMDB_API_key + '&language=en-US'),
                        images: this.http.get<MovieImagesResponseData>(baseURL + '/movie/' + id + 
                            '/images?api_key=' + environment.TMDB_API_key + '&language=en-US&include_image_language=en%2Cnull') })
                    .subscribe((data) => {
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
                        console.log('user watchlist movie info: ');
                        console.log(movieInfo)
                        this.store.dispatch(new WatchlistActions.AddToWatchlist(movieInfo));
                    })
                });
            }))
        })
    ), {dispatch: false});

    // addToUserWatchlist = createEffect(() => this.actions$.pipe(
    //     ofType(WatchlistActions.ADD_FILM),
    //     switchMap((filmData: WatchlistActions.AddToWatchlist) => {
    //         return this.http.put('https://tyager-angular-practice-app-default-rtdb.firebaseio.com/watchlist.json', filmData.payload);
    //     })
    // ), { dispatch: false });

}
