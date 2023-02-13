import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { movieReviews } from './review.model';
import * as fromApp from '../store/app.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import * as Utils from '../shared/utils';
import { MovieDetails } from '../shared/movie-info.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReviewsListComponent implements OnInit, OnDestroy {
  reviewsSubscription: Subscription;  
  reviewsList: movieReviews[];
  tableDisplayCols = ['title', 'lastWatched', 'rating', 'timesLogged', 'options', 'expand'];

  columnsToDisplayWithExpand = [...this.tableDisplayCols, 'expand'];
  expandedElement: movieReviews | null;

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

  formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-us', { year:"numeric", month:"long", day:"numeric" });
  }

  goToReviews(film: movieReviews) {
    this.router.navigate([`./id/${film.movieDetails.id}`], { relativeTo: this.route });
  }

  goToAddReview(film: movieReviews) {
    this.router.navigate([`./id/${film.movieDetails.id}`], { relativeTo: this.route, state: { edit: true} });
  }

  editReview(film: movieReviews) {
    this.router.navigate([`./id/${film.movieDetails.id}`], { relativeTo: this.route, 
      state: { edit: true, reviewData: {review: film.reviews[0], index: 0} } });
  }

  getReleaseDate(film: MovieDetails) { return Utils.getReleaseDate({ movieDetails: film, movieCrew: null, movieImagePaths: null }) };
  getRating(film: MovieDetails) { return Utils.getRating({ movieDetails: film, movieCrew: null, movieImagePaths: null }) };


  ngOnDestroy() {
    this.reviewsSubscription.unsubscribe();
  }
}
