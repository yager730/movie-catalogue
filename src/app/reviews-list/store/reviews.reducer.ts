import { movieReview, movieReviews } from "../review.model";
import * as ReviewActions from "./reviews.actions";

export interface State {
    movieInfoLoaded: boolean;
    reviewsList: movieReviews[];
}

const initState: State = {
    movieInfoLoaded: false,
    reviewsList: []
};

export function reviewsReducer(state: State = initState, action: ReviewActions.ReviewActions) {
    let updatedReviewList: movieReviews[];
    let updateIndex: number;
    let updatedReviews: movieReview[];
    let updatedMovieReviews: movieReviews;

    switch (action.type) {
        case ReviewActions.ADD_REVIEW:
            if (state.reviewsList.map(review => review.movieDetails.id).includes(action.payload.movieInfo.movieDetails.id)) {
                updatedReviewList = [...state.reviewsList];
                updateIndex = state.reviewsList.findIndex((el) => el.movieDetails.id === action.payload.movieInfo.movieDetails.id);
                updatedReviews = [...state.reviewsList[updateIndex].reviews, action.payload.review];
                updatedMovieReviews = {
                    movieDetails: action.payload.movieInfo.movieDetails, 
                    reviews: updatedReviews
                }
                updatedReviewList[updateIndex] = updatedMovieReviews;
            } else {
                updatedReviewList = [...state.reviewsList, {
                    movieDetails: action.payload.movieInfo.movieDetails, 
                    reviews: [action.payload.review] }]
            }
            return {
                ...state,
                reviewsList: updatedReviewList
            };
        case ReviewActions.EDIT_REVIEW:
            updatedReviewList = [...state.reviewsList];
            updateIndex = state.reviewsList.findIndex((el) => el.movieDetails.id === action.payload.movieInfo.movieDetails.id);
            const updatedReview = action.payload.review;
            updatedReviews = updatedReviewList[updateIndex].reviews.map((el, i) => i === action.payload.index ? updatedReview : el);
            updatedMovieReviews = { 
                movieDetails: action.payload.movieInfo.movieDetails,
                reviews: updatedReviews
            }
            updatedReviewList[updateIndex] = updatedMovieReviews;
            return {
                ...state,
                reviewsList: updatedReviewList
            };
        case ReviewActions.REMOVE_REVIEW:
            updatedReviewList = [...state.reviewsList];
            updateIndex = state.reviewsList.findIndex((el) => el.movieDetails.id === action.payload.movieInfo.movieDetails.id);
            updatedReviews = updatedReviewList[updateIndex].reviews.filter((review, index) => index !== action.payload.index);
            updatedMovieReviews = {
                movieDetails: action.payload.movieInfo.movieDetails,
                reviews: updatedReviews
            }
            updatedReviewList[updateIndex] = updatedMovieReviews;
            return {
                ...state,
                reviewsList: updatedReviewList
            };
        case ReviewActions.LOAD_MOVIE:
            return {
                ...state,
                movieInfoLoaded: false
            }
        case ReviewActions.MOVIE_LOADED:
            return {
                ...state,
                movieInfoLoaded: true
            }
        default:
            return state;
    }
}
