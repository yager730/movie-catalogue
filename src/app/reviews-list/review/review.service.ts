import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, forkJoin, map, Observable, take } from "rxjs";
import { CrewResponseData, MovieDetailsResponseData, MovieImagesResponseData } from "src/app/search/store/api-response.interfaces";
import { movieInfo } from "src/app/shared/movie-info.model";
import { environment } from "src/environments/environments";

const tmdbURL = 'https://api.themoviedb.org/3';

@Injectable()
export class ReviewsService {
    
    constructor(private http: HttpClient) {};

    fetchMovieData (movieId: string): Observable<movieInfo | string> {
        return forkJoin({
            details: this.http.get<MovieDetailsResponseData>(tmdbURL + '/movie/' + movieId + 
                '?api_key=' + environment.TMDB_API_key + '&language=en-US'),
            crew: this.http.get<CrewResponseData>(tmdbURL + '/movie/' + movieId + 
                '/credits?api_key=' + environment.TMDB_API_key + '&language=en-US'),
            images: this.http.get<MovieImagesResponseData>(tmdbURL + '/movie/' + movieId + 
                '/images?api_key=' + environment.TMDB_API_key + '&language=en-US&include_image_language=en%2Cnull') 
        })
        .pipe(map(resData => {
            const movieDetails = {
                id: resData.details.id,
                title: resData.details.title,
                tagline: resData.details.tagline,
                runtime: resData.details.runtime,
                release_date: resData.details.release_date,
                score: resData.details.vote_average,
                poster: resData.details.poster_path ? 'https://image.tmdb.org/t/p/original' + resData.details.poster_path : null,
                overview: resData.details.overview
            }
            const crewData = { cast: resData.crew.cast, crew: resData.crew.crew }
            const image_paths = resData.images.backdrops.map((backdrop) => 'https://image.tmdb.org/t/p/original' + backdrop.file_path)
            return {
                movieDetails: movieDetails,
                movieCrew: crewData,
                movieImagePaths: image_paths
            };
        }),
        catchError(() => {
            return 'Movie Not Found'
        }))
    };

}
