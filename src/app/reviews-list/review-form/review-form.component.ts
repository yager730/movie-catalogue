import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { movieInfo } from 'src/app/shared/movie-info.model';
import * as fromApp from '../../store/app.reducer';
import * as ReviewsActions from '../store/reviews.actions';
import * as WatchlistActions from '../../watchlist/store/watchlist.actions';
import { Store } from '@ngrx/store';
import { movieReview } from '../review.model';
import { Subscription, take } from 'rxjs';

export function ratingValidator(): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {
    const value: number = control.value;
    if (!value) {
        return null;
    }
    return !Number.isInteger(value * 2) ? { validRating : true } : null;
  }
}

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent implements OnInit { 
  @Input() movie: movieInfo;
  @Input() formData?: {review: movieReview, index: number };
  @Output() formEvent = new EventEmitter<string>();
  
  watchlistSub: Subscription;
  filmInWatchlist: boolean;

  minDate: Date;
  maxDate: Date;

  displayConfirmationPrompt: boolean = false;
  displayPromptText: string;
  promptConfirmText: string;
  promptDenyText: string;

  newEntry: boolean;

  reviewForm: FormGroup<{
    reviewText: FormControl<string>;
    rating: FormControl<number>;
    watchDate: FormControl<string | Date>; 
  }>;

  constructor(private route: ActivatedRoute, private router: Router, 
    private store: Store<fromApp.AppState>) {};

  ngOnInit() {
    this.newEntry = this.formData ? false : true;
    this.reviewForm = new FormGroup({
      reviewText: new FormControl<string>(this.newEntry ? null : this.formData.review.reviewText),
      rating: new FormControl<number>(this.newEntry ? null : this.formData.review.rating, [Validators.required, ratingValidator()]),
      watchDate: new FormControl<Date | string>(this.newEntry ? null : this.formData.review.watchDate, Validators.required)
    });
    this.minDate = new Date(this.movie.movieDetails.release_date);
    this.maxDate = new Date();
    console.log (this.reviewForm.value);
    this.watchlistSub = this.store.select('watchlist').pipe(take(1))
    .subscribe(watchlistData => {
      this.filmInWatchlist = watchlistData.films.map(film => film.movieDetails.id).includes(this.movie.movieDetails.id); 
    })
  }

  goBackToReviews() {
    this.router.navigate(['reviews']);
  }

  onSubmit() {
    if (!this.reviewForm.valid){
      return;
    } 
    const formWatchDate = this.reviewForm.value['watchDate'];

    if (this.newEntry) {
      // If user is reviewing a movie in their watchlist, ask if user wants it removed...
      if (this.filmInWatchlist) {
        this.confirmationPrompt('Remove from watchlist');
      } else {
        this.submitNewReview();
      }
    } else { 
      this.store.dispatch(new ReviewsActions.EditReview(
        { movieInfo: this.movie, index: this.formData.index, 
          review: { 
            rating: this.reviewForm.value['rating'],
            reviewText: this.reviewForm.value['reviewText'],
            watchDate: (formWatchDate instanceof Date) ? new Date(formWatchDate).toISOString() : formWatchDate 
          } 
        }
      ));
      this.formEvent.emit('Submitted Review'); 
    }
  }

  submitAndRemoveFromWatchlist(remove: boolean) {
    if (remove) {
      this.store.dispatch(new WatchlistActions.RemoveFromWatchlist(this.movie.movieDetails.id));
    }
    this.submitNewReview();
  }

  submitNewReview() {
    const formWatchDate = this.reviewForm.value['watchDate'];
    this.store.dispatch(new ReviewsActions.AddReview(
      { movieInfo: this.movie, 
        review: { 
          rating: this.reviewForm.value['rating'],
          reviewText: this.reviewForm.value['reviewText'],
          watchDate: (formWatchDate instanceof Date) ? new Date(formWatchDate).toISOString() : formWatchDate
        }
      }
    ));
    this.formEvent.emit('Submitted Review');
  }

  confirmationPrompt(promptType: string) {
    switch (promptType) {
      case 'Remove from watchlist':
        this.displayConfirmationPrompt = true;
        this.displayPromptText = "This film was found in your watchlist. Would you like to remove it?"
        this.promptConfirmText = "Yes, remove from watchlist"
        this.promptDenyText = "No, keep on watchlist"
        return;
      default: 
        return;
    }
  }

  reset() {
    this.displayConfirmationPrompt = false;
  }

  handleCancel() {
    this.formEvent.emit('Cancelled Review');
  }

  deleteReview() {
    this.store.dispatch(new ReviewsActions.RemoveReview(
      { movieInfo: this.movie, index: this.formData.index }));
    this.formEvent.emit('Deleted Review');
  }

}
