import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environments';
import { CrewResponseData, MovieDetailsResponseData, MovieImagesResponseData, SearchResponseData } from './api-response.interfaces';

import * as WatchlistActions from '../../watchlist/store/watchlist.actions';
import * as SearchActions from './search.actions';

const baseURL = 'https://api.themoviedb.org/3';

const handleError = (errorResponse: any) => {
    let errorMessage = 'An unkown error has occurred';
    if (!errorResponse.error || !errorResponse.error.error) {
        return of(new SearchActions.SearchError(errorMessage));
    }
    switch (errorResponse.error.error.message) {
        case 'NO_SEARCH_TERM_ENTERED':
            errorMessage = 'Please Enter A Search Term';
            break;
    }
    return of(new SearchActions.SearchError(errorMessage));
};

@Injectable()
export class SearchEffects {

    constructor(private actions$: Actions, private http: HttpClient) {}

    movieSearch = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.MOVIE_SEARCH),
        switchMap((search: SearchActions.MovieSearch) => {
            return this.http.get<SearchResponseData>(baseURL + '/search/movie?api_key=' + environment.TMDB_API_key 
            + '&language=en-US&include_adult=false&query=' + search.payload.replace(" ", "%20"))
            .pipe(map(resData => {
                const numResults = resData.total_results;
                const searchResults = resData.results.map(result => {
                    return {
                        id: result.id, 
                        title: result.title, 
                        release_date: result.release_date
                    }
                });
                return new SearchActions.MovieSearchResults({
                    results_found: numResults,
                    results_list: searchResults
                });
            }),
            catchError(errorResponse => {
                return handleError(errorResponse);
            }))
        })
    ));

    getMovieDetails = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.MOVIE_SELECT),
        switchMap((selectedMovie: SearchActions.MovieSelect) => {
            return this.http.get<MovieDetailsResponseData>(baseURL + '/movie/' + selectedMovie.payload + 
            '?api_key=' + environment.TMDB_API_key + '&language=en-US')
            .pipe(map(resData => {
                return new SearchActions.SelectedMovieDetails({
                    id: resData.id,
                    title: resData.title,
                    tagline: resData.tagline,
                    runtime: resData.runtime,
                    release_date: resData.release_date,
                    score: resData.vote_average,
                    poster: resData.poster_path ? 'https://image.tmdb.org/t/p/original' + resData.poster_path : null,
                    overview: resData.overview
                });
            }));
        })
    ));

    getMovieCrew = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.MOVIE_SELECT),
        switchMap((selectedMovie: SearchActions.MovieSelect) => {
            return this.http.get<CrewResponseData>(baseURL + '/movie/' + selectedMovie.payload + 
            '/credits?api_key=' + environment.TMDB_API_key + '&language=en-US')
            .pipe(map(resData => {
                return new SearchActions.SelectedMovieCrew({
                    cast: resData.cast,
                    crew: resData.crew 
                });
            }));
        })
    ));

    getMovieImages = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.MOVIE_SELECT),
        switchMap((selectedMovie: SearchActions.MovieSelect) => {
            return this.http.get<MovieImagesResponseData>(baseURL + '/movie/' + selectedMovie.payload + 
            '/images?api_key=' + environment.TMDB_API_key + '&language=en-US&include_image_language=en%2Cnull')
            .pipe(map(resData => {
                const image_paths = resData.backdrops.map((backdrop) => 'https://image.tmdb.org/t/p/original' + backdrop.file_path)
                return new SearchActions.SelectedMovieImages({
                    images: image_paths
                });
            }));
        })
    ));

    updateWatchlist = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.MOVIE_SELECT_DETAILS),
        map(() => new WatchlistActions.GetUpdatedWatchlist())
    ))
}
