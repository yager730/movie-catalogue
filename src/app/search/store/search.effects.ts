import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environments';
import { CrewResponseData, MovieDetailsResponseData, MovieImagesResponseData, SearchResponseData } from './api-response.interfaces';

import * as WatchlistActions from '../../watchlist/store/watchlist.actions';
import * as ReviewsActions from '../../reviews-list/store/reviews.actions';
import * as SearchActions from './search.actions';

const baseURL = environment.TMDB_Base_URL;

const handleError = (errorResponse: any) => {
    let errorMessage = 'An unkown error has occurred';
    if (!errorResponse.error || !errorResponse.error.error) {
        return of(new SearchActions.DisplaySearchError(errorMessage));
    }
    switch (errorResponse.error.error.message) {
        case 'NO_SEARCH_TERM_ENTERED':
            errorMessage = 'Please Enter A Search Term';
            break;
    }
    return of(new SearchActions.DisplaySearchError(errorMessage));
};

@Injectable()
export class SearchEffects {

    constructor(private actions$: Actions, private http: HttpClient) {}

    // Get top 15 results for popular movies
    fetchPopularMovies = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.FETCH_MOVIES),
        switchMap((filter: SearchActions.FetchMovies) => {
            return this.http.get<SearchResponseData>(baseURL + '/movie/' + filter.payload + '?api_key=' + environment.TMDB_API_key 
            + '&page=1&language=en-US')
            .pipe(map(resData => {
                const searchResults = resData.results.map(result => {
                    return {
                        id: result.id, 
                        title: result.title, 
                        release_date: result.release_date
                    }
                });
                return new SearchActions.YieldSearchResults({
                    results_found: 15,
                    results_list: searchResults.slice(0, 15)
                });
            }),
            catchError(errorResponse => {
                return handleError(errorResponse);
            }))
        })
    ));

    movieSearch = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.INITIATE_SEARCH),
        switchMap((search: SearchActions.SearchForTerm) => {
            return this.http.get<SearchResponseData>(baseURL + '/search/movie?api_key=' + environment.TMDB_API_key 
            + '&page=1&language=en-US&include_adult=false&query=' + search.payload.replace(" ", "%20"))
            .pipe(map(resData => {
                const numResults = resData.total_results;
                const searchResults = resData.results.map(result => {
                    return {
                        id: result.id, 
                        title: result.title, 
                        release_date: result.release_date
                    }
                });
                return new SearchActions.YieldSearchResults({
                    results_found: numResults,
                    results_list: searchResults,
                });
            }),
            catchError(errorResponse => {
                return handleError(errorResponse);
            }))
        })
    ));

    viewResultsPage = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.VIEW_SEARCH_RESULTS_PAGE),
        switchMap((searchData: SearchActions.ViewResultsPage) => {
            return this.http.get<SearchResponseData>(baseURL + '/search/movie?api_key=' + environment.TMDB_API_key 
            + '&page=' + searchData.payload.page_number + '&language=en-US&include_adult=false&query=' + searchData.payload.search_term.replace(" ", "%20"))
            .pipe(map(resData => {
                const numResults = resData.total_results;
                const searchResults = resData.results.map(result => {
                    return {
                        id: result.id, 
                        title: result.title, 
                        release_date: result.release_date
                    }
                });
                return new SearchActions.UpdateSearchResultsPage(searchResults);
            }),
            catchError(errorResponse => {
                return handleError(errorResponse);
            }))
        })
    ));

    selectFirstResult = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.YIELD_SEARCH_RESULTS),
        map((searchResults: SearchActions.YieldSearchResults) => new SearchActions.SelectMovie(searchResults.payload.results_list[0].id))
    ))

    getMovieInfo = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.SELECT_MOVIE),
        switchMap((selectedMovie: SearchActions.SelectMovie) => {
            return forkJoin({
                details: this.http.get<MovieDetailsResponseData>(baseURL + '/movie/' + selectedMovie.payload + 
                    '?api_key=' + environment.TMDB_API_key + '&language=en-US'),
                crew: this.http.get<CrewResponseData>(baseURL + '/movie/' + selectedMovie.payload + 
                    '/credits?api_key=' + environment.TMDB_API_key + '&language=en-US'),
                images: this.http.get<MovieImagesResponseData>(baseURL + '/movie/' + selectedMovie.payload + 
                    '/images?api_key=' + environment.TMDB_API_key + '&language=en-US&include_image_language=en%2Cnull') })
            .pipe(map(resData => {
                const movieDetails = {
                    id: resData.details.id,
                    title: resData.details.title,
                    tagline: resData.details.tagline,
                    runtime: resData.details.runtime,
                    release_date: resData.details.release_date,
                    score: resData.details.vote_average,
                    poster: resData.details.poster_path ? environment.TMDB_Images_URL + resData.details.poster_path : null,
                    overview: resData.details.overview
                }
                const crewData = { cast: resData.crew.cast, crew: resData.crew.crew }
                const image_paths = resData.images.backdrops.map((backdrop) => environment.TMDB_Images_URL + backdrop.file_path)
                return new SearchActions.GetSelectedMovieInfo({
                    movieDetails: movieDetails,
                    movieCrew: crewData,
                    movieImagePaths: image_paths
                });
            }));
        })
    ))

    // get data to enable or disable the watchlist button for a newly selected movie
    updateWatchlist = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.GET_SELECTED_MOVIE_INFO),
        map(() => new WatchlistActions.GetUpdatedWatchlist())
    ))

    getCurrentReviews = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.GET_SELECTED_MOVIE_INFO),
        map(() => new ReviewsActions.GetCurrentReviews())
    ))
}
