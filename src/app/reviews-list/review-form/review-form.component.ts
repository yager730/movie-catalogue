import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { movieInfo } from 'src/app/shared/movie-info.model';
import * as fromApp from '../../store/app.reducer';
import * as ReviewsActions from '../store/reviews.actions';
import { Store } from '@ngrx/store';
import { movieReview } from '../review.model';

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
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit { 
  @Input() movie: movieInfo;
  @Input() formData?: {review: movieReview, index: number };
  @Output() formEvent = new EventEmitter<string>();

  minDate: Date;
  maxDate: Date;

  newEntry: boolean;

  reviewForm: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, 
    private store: Store<fromApp.AppState>) {};

  ngOnInit() {
    this.newEntry = this.formData ? false : true;
    this.reviewForm = new FormGroup({
      reviewText: new FormControl(this.newEntry ? null : this.formData.review.reviewText),
      rating: new FormControl(this.newEntry ? null : this.formData.review.rating, [Validators.required, ratingValidator()]),
      watchDate: new FormControl(this.newEntry ? null : this.formData.review.watchDate, Validators.required)
    });
    this.minDate = new Date(this.movie.movieDetails.release_date);
    this.maxDate = new Date();
    console.log (this.reviewForm.value);
  }

  goBackToReviews() {
    this.router.navigate(['reviews']);
  }

  onSubmit() {
    console.log(this.reviewForm.value);
    
    if (!this.reviewForm.valid){
      return;
    } 

    if (this.newEntry) {
      this.store.dispatch(new ReviewsActions.AddReview(
        { movieInfo: this.movie, review: this.reviewForm.value }));
    } else  { this.store.dispatch(new ReviewsActions.EditReview(
      { movieInfo: this.movie, index: this.formData.index, review: this.reviewForm.value })); }
    this.formEvent.emit('Submitted Review');
  }

  handleCancel() {
    this.formEvent.emit('Cancelled Review');
  }

  goBackToLastPage() {
    return;
    //history.back();
  }

  deleteReview() {
    this.store.dispatch(new ReviewsActions.RemoveReview(
      { movieInfo: this.movie, index: this.formData.index }));
    this.formEvent.emit('Deleted Review');
  }

}
