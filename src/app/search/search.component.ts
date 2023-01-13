import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as SearchActions from './store/search.actions';
import { SearchResult } from './search-result.model';
import { map, Subscription } from 'rxjs';

import * as fromApp from '../store/app.reducer';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  search: FormGroup;
  searchResults: SearchResult[];
  currentSearchTerm: string;
  submittedSearchTerm: string;
  numResults: number;
  movieSelected: number;
  subscription: Subscription;
  @ViewChild('paginator') paginator: MatPaginator;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.search = new FormGroup({
      searchTerm: new FormControl()
    });
    this.subscription = this.store.select('search')
    .pipe(map(searchState => searchState))
    .subscribe((results) => {
        this.submittedSearchTerm = results.searchTerm;
        this.searchResults = results.results;
        this.numResults = results.numResults;
        this.movieSelected = results.selectedMovie;
    });
  }

  onSubmit() {
    this.store.dispatch(new SearchActions.UpdateSearchTerm(this.currentSearchTerm));
    this.store.dispatch(new SearchActions.MovieSearch(this.currentSearchTerm));
    this.paginator.firstPage();
  }

  handlePagination(event?:PageEvent) {
    const newPage = event.pageIndex;
    console.log('Moved to page: ' + newPage);
    this.store.dispatch(new SearchActions.ViewResultsPage({page_number: newPage + 1, search_term: this.submittedSearchTerm}));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
