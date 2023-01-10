import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environments';
import { SearchService } from '../search.service';

import * as SearchActions from './search.actions';

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

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private searchService: SearchService) {}

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

}
