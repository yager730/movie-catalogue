import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as SearchActions from './store/search.actions';
import { SearchResult } from './search-result.model';
import { map, Subscription } from 'rxjs';

import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  search: FormGroup;
  searchResults: SearchResult[];
  numResults: number;
  movieSelected: number;
  subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.search = new FormGroup({
      searchTerm: new FormControl()
    });
    this.subscription = this.store.select('search')
    .pipe(map(searchState => searchState))
    .subscribe((results) => {
        this.searchResults = results.results;
        this.numResults = results.numResults;
        this.movieSelected = results.selectedMovie;
    });
  }

  onSubmit() {
    this.store.dispatch(new SearchActions.MovieSearch(this.search.value.searchTerm));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
