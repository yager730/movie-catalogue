import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { environment } from "../../environments/environments";

@Injectable({providedIn: 'root'})
export class SearchService {
    baseURL: string = 'https://api.themoviedb.org/3';
    
    constructor(private http: HttpClient) {}

    search(term: string) {
        return this.http.get(this.baseURL + '/search/movie?api_key=' + environment.TMDB_API_key 
        + '&language=en-US&include_adult=false&query=' + term.replace(" ", "%20"))
        .pipe(catchError(this.handleError));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        // Want to handle no search term being entered
        let errorMessage = 'An error has occurred';
        return throwError(() =>  new Error(errorMessage));
    }
}