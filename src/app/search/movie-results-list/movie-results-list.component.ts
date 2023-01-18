import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SearchResult } from '../search-result.model';
import * as SearchActions from '../store/search.actions';

import * as fromApp from '../../store/app.reducer';
import { map, Subscription } from 'rxjs';

@Component({
  selector: 'app-movie-results-list',
  templateUrl: './movie-results-list.component.html',
  styleUrls: ['./movie-results-list.component.css']
})
export class MovieResultsListComponent {
  @Input() movieResult: SearchResult;
  subscription: Subscription;
  movieSelected: number;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscription = this.store.select('search')
    .pipe(map(searchState => searchState))
    .subscribe((results) => {
      this.movieSelected = results.selectedMovie;
    });
  }

  onClick() {
    console.log("Clicked movie with ID:" + this.movieResult.id)
    if (this.movieResult.id === this.movieSelected) { return }
    this.store.dispatch(new SearchActions.SelectMovie(this.movieResult.id));
  }
}
