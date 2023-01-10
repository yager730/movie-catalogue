import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SearchResult } from '../search-result.model';
import * as SearchActions from '../store/search.actions';

import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-movie-results-list',
  templateUrl: './movie-results-list.component.html',
  styleUrls: ['./movie-results-list.component.css']
})
export class MovieResultsListComponent {
  @Input() movieResult: SearchResult;

  constructor(private store: Store<fromApp.AppState>) {}

  onClick() {
    console.log("Clicked movie with ID:" + this.movieResult.id)
    this.store.dispatch(new SearchActions.MovieSelect(this.movieResult.id));
  }
}
