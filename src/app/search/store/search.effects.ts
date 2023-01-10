import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environments';

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
                        overview: result.overview, 
                        poster: result.poster_path
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
    ))

    movieSelect = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.MOVIE_SELECT),
        switchMap((selectedMovie: SearchActions.MovieSelect) => {
            return this.http.get<MovieDetailsResponseData>(baseURL + '/movie/' + selectedMovie.payload + 
            '?api_key=' + environment.TMDB_API_key + '&language=en-US').pipe(map(resData => {
                return new SearchActions.SelectedMovieDetails({
                    id: resData.id,
                    title: resData.title,
                    tagline: resData.tagline,
                    runtime: resData.runtime,
                    release_date: resData.release_date,
                    poster: 'https://image.tmdb.org/t/p/w500' + resData.poster_path,
                    overview: resData.overview,
                });
            }));
        })
    ));
}

export interface SearchResponseData {
    page: number;
    results: {
        poster_path: string | null;
        adult: boolean;
        overview: string;
        release_date: string;
        genre_ids: number[];
        id: number;
        original_title: string;
        original_language: string;
        title: string;
        backdrop_path: string | null;
        popularity: number;
        vote_count: number;
        video: boolean;
        vote_average: number; } [];
    total_results: number;
    total_pages: number;
}

export interface CrewResponseData {
    id: number,
    cast: {
        adult: boolean,
        gender: number | null,
        id: number,
        known_for_department: string,
        name: string,
        original_name: string,
        popularity: number,
        profile_path: string | null,
        cast_id: number,
        character: string,
        credit_id: string,
        order: number } [],
    crew: {
        adult: boolean,
        gender: number | null,
        id: number,
        known_for_department: string,
        name: string,
        original_name: string,
        popularity: number,
        profile_path: string | null,
        credit_id: string,
        department: string,
        job: string } []
}

export interface MovieDetailsResponseData {
    adult: boolean;
    backdrop_path: string | null;
    belongs_to_collection: null | object;
    budget: number;
    genres: {
        id: number;
        name: string;
    } [];
    homepage: string | null;
    id: number;
    imdb_id: string | null;
    original_language: string;
    original_title: string;
    overview: string | null;
    popularity: number;
    poster_path: string | null;
    production_companies: {
        name: string;
        id: number;
        logo_path: string | null;
        origin_country: string; } [];
    production_countries: {
        iso_3166_1: string;
        name: string; } [];
    release_date: string;
    revenue: number;
    runtime: number | null;
    spoken_languages: {
        iso_639_1: string;
        name: string; } [];
    status: string;
    tagline: string | null;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number
}
