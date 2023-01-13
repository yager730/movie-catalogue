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
  @ViewChild('paginator') paginator: MatPaginator;
  displaying = 'Most Popular';

  search: FormGroup;
  searchResults: SearchResult[];
  currentSearchTerm: string;
  submittedSearchTerm: string;
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
        this.submittedSearchTerm = results.searchTerm;
        this.searchResults = results.results;
        this.numResults = results.numResults;
        this.movieSelected = results.selectedMovie;
    });
    this.store.dispatch(new SearchActions.FetchMovies('popular'));
    //console.log(this.searchResults);
    //this.store.dispatch(new SearchActions.MovieSelect(this.searchResults[0].id));
  }

  onSubmit() {
    this.displaying = 'Search';
    this.store.dispatch(new SearchActions.UpdateSearchTerm(this.currentSearchTerm));
    this.store.dispatch(new SearchActions.MovieSearch(this.currentSearchTerm));
    this.paginator.firstPage();
  }

  showMovies(filter: 'top_rated' | 'popular' | 'upcoming') {
    switch (filter) {
      case 'top_rated':
        if (this.displaying === 'Top Rated') { return }
        this.displaying = 'Top Rated';
        break;
      case 'popular':
        if (this.displaying === 'Most Popular') { return }
        this.displaying = 'Most Popular';
        break;
      case 'upcoming':
        if (this.displaying === 'Upcoming') { return }
        this.displaying = 'Upcoming';
        break;
      default:
        break;
    }
    this.store.dispatch(new SearchActions.FetchMovies(filter));
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
