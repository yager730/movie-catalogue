import { MovieDetails } from "../shared/movie-info.model"

export interface movieReview {
    reviewId: string,
    movie_details: MovieDetails
    user_rating: number,
    user_review_text: string,
    user_last_watched_date: Date,
    user_last_edited_date: Date
};
