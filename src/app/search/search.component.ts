import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as SearchActions from './store/search.actions';
import { SearchService } from './search.service';
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
  subscription: Subscription;

  constructor(private searchService: SearchService, private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.search = new FormGroup({
      searchTerm: new FormControl()
    });
    this.subscription = this.store.select('search')
    .pipe(map(searchState => searchState.results))
    .subscribe(
      (results: SearchResult[]) => {
        this.searchResults = results;
      }
    );
  }

  onSubmit() {
    this.store.dispatch(new SearchActions.MovieSearch(this.search.value.searchTerm));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
