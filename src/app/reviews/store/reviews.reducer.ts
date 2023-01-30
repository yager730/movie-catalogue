import { movieReview } from "../review.model";
import * as ReviewActions from "./reviews.actions";

export interface State {
    reviews: movieReview[];
}

const initState: State = {
    reviews: [
        {
            reviewId: '1',
            movie_details: {
                id: 290250,
                title: 'The Nice Guys',
                tagline: 'Private dicks.',
                runtime: 120,
                release_date: '06-05-1984',
                poster: '/img-not-found',
                score: 10,
                overview: 'Filler text'
            },
            user_review_text: 'It was good',
            user_last_edited_date: new Date('06-29-2002'),
            user_last_watched_date: new Date('06-25-2002'),
            user_rating: 7
        },
        {
            reviewId: '2',
            movie_details: {
                id: 279,
                title: 'Amadeus',
                tagline: 'Music music music',
                runtime: 125,
                release_date: '03-24-1990',
                poster: '/img-not-found',
                score: 8.7,
                overview: 'Filler-er text'
            },
            user_review_text: 'It was bad',
            user_last_edited_date: new Date('07-30-2009'),
            user_last_watched_date: new Date('07-30-2000'),
            user_rating: 3.5
        }
    ]
};

export function reviewsReducer(state: State = initState, action: ReviewActions.ReviewActions) {
    switch (action.type) {
        case ReviewActions.ADD_REVIEW:
            return {
                ...state,
                reviews: [...state.reviews, action.payload]
            };
        default:
            return state;
    }
}
