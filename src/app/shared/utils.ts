// Utility helper functions
import { movieInfo } from "./movie-info.model";

export function getDirector(film: movieInfo) {
    if (film.movieCrew.crew.map(el => el.job).includes('Director')) {
      return film.movieCrew.crew.filter(person =>  person.job === 'Director')[0].name;
    } else { return 'n/a' }
}

export function getReleaseDate(film: movieInfo) {
    if (film.movieDetails.release_date) {
      const date = new Date(film.movieDetails.release_date);
      return date.toLocaleDateString('en-us', { year:"numeric", month:"long", day:"numeric" })
    } else { return 'n/a' }
}

export function getRating(film: movieInfo) {
    return Math.round(film.movieDetails?.score * 100) / 100; 
}