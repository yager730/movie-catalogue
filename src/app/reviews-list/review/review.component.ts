import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Subscription, take } from 'rxjs';
import { movieInfo } from 'src/app/shared/movie-info.model';
import { ReviewsService } from '../review.service';
import * as Utils from '../../shared/utils';
import * as fromApp from '../../store/app.reducer';
import * as ReviewsActions from '../store/reviews.actions';
import { Store } from '@ngrx/store';
import { movieReview, movieReviews } from '../review.model';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  providers: [ReviewsService]
})
export class ReviewComponent implements OnInit {
  reviewStoreSubscription: Subscription;
  reviews: movieReview [] = [];
  reviewData: { review: movieReview, index: number } = null;

  loadingPage: boolean = true;
  apiError: boolean = false;
  
  movie: movieInfo;

  editMode: boolean = false;
  reviewDataForUser: boolean;
  
  reviewForm: FormGroup;

  constructor(private ReviewsService: ReviewsService, private router: Router, private store: Store<fromApp.AppState>) {};

  ngOnInit() {
    this.reviewForm = new FormGroup({
      reviewText: new FormControl(),
      rating: new FormControl(),
      watchDate: new FormControl()
    });

    // 99% of time users will navigate to this page via button press, which pass along movieInfo
    if (history.state['movieInfo']) {
      this.store.dispatch(new ReviewsActions.MovieInfoLoaded());
      this.movie = history.state['movieInfo'];
      // Will need a more robust check here once I actually am able to save reviews
      this.editMode = true;
    } else {
      if (history.state['edit']) { 
        if (history.state['reviewData']){
          this.reviewData = history.state['reviewData'];
        }
        this.editMode = true; 
      }
      console.log('Navigated to page directly, fetching data...')
      this.store.dispatch(new ReviewsActions.LoadMovieInfo());
      this.ReviewsService.fetchMovieData(location.href.split('/').pop())
      .pipe(take(1)).subscribe(results => {
        if (typeof(results) === 'string') {
          this.apiError = true
          this.store.dispatch(new ReviewsActions.MovieInfoLoaded());
        } else { 
          this.movie = results; 
          this.store.dispatch(new ReviewsActions.MovieInfoLoaded());
        }
      });
    }

    this.reviewStoreSubscription = this.store.select('reviews')
    .subscribe(data => {
      this.loadingPage = !data.movieInfoLoaded;
      if (!this.loadingPage) {
        this.reviews = this.getReviews(this.movie?.movieDetails.id, data.reviewsList);
      }
    })
  };

  getReviews(id: number, reviewList: movieReviews[]): movieReview [] {
    if (reviewList.map(el => el.movieDetails.id).includes(id)) {
      return reviewList.filter(el => el.movieDetails.id === id)[0].reviews;
    } else { return [] }
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-us', { year:"numeric", month:"long", day:"numeric" });
  }

  handleFormEvent(event: string) {
    this.editMode = false;
  }

  goBackToLastPage() {
    console.log(document.referrer);
    if(document.referrer == "") {
      // If user manually enters review page URL...
      this.router.navigate(['/search']);
    } else {
      history.back();
    }
  }

  addReview() {
    this.editMode = true;
    this.reviewData = null;
  }

  editReview(review: movieReview, index: number) {
    this.editMode = true;
    this.reviewData = { review: review, index: index };
  }

  deleteReview(index: number) {
    this.store.dispatch(new ReviewsActions.RemoveReview({movieInfo: this.movie, index: index }));
  }

  goBackToReviews() {
    this.router.navigate(['reviews']);
  }

  getDirector(film: movieInfo) { return Utils.getDirector(film) };
  getReleaseDate(film: movieInfo) { return Utils.getReleaseDate(film) };
  getRating(film: movieInfo) { return Utils.getRating(film) };

  onSubmit() {
    console.log(this.reviewForm.value);
    this.store.dispatch(new ReviewsActions.AddReview({ movieInfo: this.movie, review: this.reviewForm.value }));
    this.editMode = false;
  }

  handleCancel() {
    this.editMode = false;
  }

}
