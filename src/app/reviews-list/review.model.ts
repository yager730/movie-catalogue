import { MovieDetails, movieInfo } from "../shared/movie-info.model"

export interface movieReview {
    rating: number,
    reviewText: string,
    watchDate: Date
    // If you want to track reviews by when they were most recently edited...
    // lastEdited: Date
};

// Review List is an array of movieReviews
export interface movieReviews {
    movieDetails: MovieDetails,
    reviews: movieReview []
}
