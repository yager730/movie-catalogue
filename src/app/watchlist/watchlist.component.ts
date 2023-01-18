import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import { movieInfo } from '../shared/movie-info.model';
import { MatSort, Sort } from '@angular/material/sort';

import * as WatchlistActions from './store/watchlist.actions';
import { MatTableDataSource } from '@angular/material/table';

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit, OnDestroy {
  watchlistSubscription: Subscription;
  watchlistDataSource: MatTableDataSource<movieInfo> = new MatTableDataSource<movieInfo>();
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  sortedData: movieInfo[];
  
  tableView = false;
  tableDisplayCols = ['title', 'director', 'date', 'rating', 'options'];

  constructor(
    private store: Store<fromApp.AppState> 
  ) { }

  ngOnInit(): void {
    this.watchlistSubscription = this.store.select('watchlist')
    .subscribe(state => {
      this.watchlistDataSource.data = state.films;
      this.sortedData = this.watchlistDataSource.data.slice();
    })
  }

  switchView() {
    this.tableView = !this.tableView;
    console.log(this.tableView ? 'switched to table view' : 'switched to watchlist view');
  }

  sortData(sort: Sort) {
    const data = this.watchlistDataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title':
          return compare(a.movieDetails.title, b.movieDetails.title, isAsc);
        case 'director':
          console.log(this.getDirector(a));
          return compare(this.getDirector(a).split(' ').slice(-1)[0], this.getDirector(b).split(' ').slice(-1)[0], isAsc);
        case 'date':
          return compare(new Date(b.movieDetails.release_date), new Date(a.movieDetails.release_date), isAsc);
        case 'rating':
          return compare(this.getRating(b), this.getRating(a), isAsc);
        default:
          return 0;
      }
    });
  }

  getDirector(film: movieInfo) {
    if (film.movieCrew.crew.map(el => el.job).includes('Director')) {
      return film.movieCrew.crew.filter(person =>  person.job === 'Director')[0].name;
    } else { return 'n/a' }
  }

  getReleaseDate(film: movieInfo) {
    if (film.movieDetails.release_date) {
      const date = new Date(film.movieDetails.release_date);
      return date.toLocaleDateString('en-us', { year:"numeric", month:"long", day:"numeric" })
    } else { return 'n/a' }
  }

  getRating(film: movieInfo) {
    return Math.round(film.movieDetails?.score * 100) / 100; 
  }

  removeWatchlistItem(film: movieInfo) {
    this.store.dispatch(new WatchlistActions.RemoveFromWatchlist(film.movieDetails.id));
  }

  ngOnDestroy() {
    this.watchlistSubscription.unsubscribe();
  }
}
