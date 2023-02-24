import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { movieReviews } from './review.model';
import * as fromApp from '../store/app.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import * as Utils from '../shared/utils';
import { MovieDetails } from '../shared/movie-info.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort, Sort } from '@angular/material/sort';

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

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
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  sortedData: movieReviews[];

  constructor ( private store: Store<fromApp.AppState>, 
    private router: Router, private route: ActivatedRoute ) {}

  ngOnInit() {
    this.reviewsSubscription = this.store.select('reviews')
    .pipe(map(reviewsState => reviewsState))
    .subscribe((results) => {
      console.log(results);
      this.reviewsList = results.reviewsList;
      this.sortData({active: "lastWatched", direction: "asc"});
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

  sortData(sort: Sort) {
    const data = this.reviewsList.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title':
          return compare(a.movieDetails.title.toLowerCase(), b.movieDetails.title.toLocaleLowerCase(), isAsc);
        case 'lastWatched':
          return compare(new Date(b.reviews[0].watchDate), 
            new Date(a.reviews[0].watchDate), isAsc);
        case 'rating':
          return compare(b.reviews[0].rating, a.reviews[0].rating, isAsc);
        case 'timesLogged':
          return compare(b.reviews.length, a.reviews.length, isAsc);
        default:
          return 0;
      }
    });
  }

  ngOnDestroy() {
    this.reviewsSubscription.unsubscribe();
  }
}
