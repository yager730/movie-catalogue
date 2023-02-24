import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import { movieInfo } from '../shared/movie-info.model';
import { MatSort, Sort } from '@angular/material/sort';

import * as WatchlistActions from './store/watchlist.actions';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import * as Utils from '../shared/utils';

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit, OnDestroy, AfterViewInit {
  watchlistSubscription: Subscription;
  paginatorSubscription: Subscription;
  
  userWatchlistLoading = false;
  
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  numResults: number;
  firstDisplayedIndex: number;
  lastDisplayedIndex: number;

  tableView = false;
  tableDisplayCols = ['title', 'director', 'date', 'rating', 'options'];
  watchlistDataSource: MatTableDataSource<movieInfo> = new MatTableDataSource<movieInfo>([]);
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  sortedData: movieInfo[];

  constructor ( private store: Store<fromApp.AppState>, private router: Router, private ref: ChangeDetectorRef ) {}

  ngOnInit(): void {
    this.watchlistSubscription = this.store.select('watchlist')
    .subscribe(state => {
      this.userWatchlistLoading = state.loadingFilmsFromFirebase;
      this.watchlistDataSource.data = state.films;
      this.numResults = state.films.length;
      this.firstDisplayedIndex = state.firstDisplayedFilmIndex;
      this.lastDisplayedIndex = state.lastDisplayedFilmIndex;
    });
  }

  ngAfterViewInit(): void {
    this.paginator.pageSize = (this.lastDisplayedIndex - this.firstDisplayedIndex);
    this.paginator.pageIndex = Math.floor(this.firstDisplayedIndex / (this.lastDisplayedIndex - this.firstDisplayedIndex));
    this.watchlistDataSource.paginator = this.paginator;
    this.ref.detectChanges();
  }

  handlePagination(event?: PageEvent) {
    const newPage = event.pageIndex;
    console.log('Moved to page: ' + newPage);
    this.store.dispatch(new WatchlistActions.GetWatchlistSlice({
      fromIndex: (event.pageSize * event.pageIndex), 
      untilIndex: (event.pageSize * (event.pageIndex + 1))
    }));
    //this.store.dispatch(new SearchActions.ViewResultsPage({page_number: newPage + 1, search_term: this.submittedSearchTerm}));
  }

  switchView() {
    this.tableView = !this.tableView;
    this.sortedData = this.watchlistDataSource.data.slice();
    console.log(this.tableView ? 'switched to table view' : 'switched to watchlist view');
  }

  sortData(sort: Sort) {
    this.watchlistDataSource.paginator.firstPage();
    const data = this.watchlistDataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title':
          return compare(a.movieDetails.title.toLowerCase(), b.movieDetails.title.toLocaleLowerCase(), isAsc);
        case 'director':
          // sort by last name first
          return compare((this.getDirector(a).split(' ').slice(-1)[0] + this.getDirector(a).split(' ')[0]), 
            (this.getDirector(b).split(' ').slice(-1)[0] + this.getDirector(b).split(' ')[0]), isAsc);
        case 'date':
          return compare(new Date(b.movieDetails.release_date), new Date(a.movieDetails.release_date), isAsc);
        case 'rating':
          return compare(this.getRating(b), this.getRating(a), isAsc);
        default:
          return 0;
      }
    });
  }

  getDirector(film: movieInfo) { return Utils.getDirector(film) };
  getReleaseDate(film: movieInfo) { return Utils.getReleaseDate(film) };
  getRating(film: movieInfo) { return Utils.getRating(film) };

  goToReviews(film: movieInfo) {
    // Reset watchlist pagination for when user goes back
    if (this.watchlistDataSource && this.numResults > 12) { this.watchlistDataSource.paginator.firstPage(); }

    this.router.navigate([`reviews/id/${film.movieDetails.id}`], { state: {
      movieInfo: {
        movieDetails: film.movieDetails,
        movieCrew:film.movieCrew,
        movieImages: film.movieImagePaths }
    }});
  }

  removeWatchlistItem(film: movieInfo) {
    this.store.dispatch(new WatchlistActions.RemoveFromWatchlist(film.movieDetails.id));
  }

  ngOnDestroy() {
    this.watchlistSubscription.unsubscribe();
  }
}
