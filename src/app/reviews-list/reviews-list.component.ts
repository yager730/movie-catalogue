import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { movieReview, movieReviews } from './review.model';
import * as fromApp from '../store/app.reducer';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.css']
})
export class ReviewsListComponent implements OnInit, OnDestroy {
  reviewsSubscription: Subscription;  
  reviewsList: movieReviews[];

  constructor ( private store: Store<fromApp.AppState>, 
    private router: Router, private route: ActivatedRoute ) {}

  ngOnInit() {
    this.reviewsSubscription = this.store.select('reviews')
    .pipe(map(reviewsState => reviewsState))
    .subscribe((results) => {
      console.log(results);
      this.reviewsList = results.reviewsList;
    })
  }

  ishClicked(film: movieReviews) {
    this.router.navigate([`./id/${film.movieId}`], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.reviewsSubscription.unsubscribe();
  }
}
