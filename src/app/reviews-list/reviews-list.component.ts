import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { movieReview } from './review.model';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.css']
})
export class ReviewsListComponent implements OnInit, OnDestroy {
  reviewsSubscription: Subscription;  
  reviews: movieReview [];

  constructor ( private store: Store<fromApp.AppState> ) {}

  ngOnInit() {
    this.reviewsSubscription = this.store.select('reviews')
    .pipe(map(reviewsState => reviewsState))
    .subscribe((results) => {
      console.log(results);
      this.reviews = results.reviews;
    })
  }

  ngOnDestroy() {
    this.reviewsSubscription.unsubscribe();
  }
}
