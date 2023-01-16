import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import { movieInfo } from '../shared/movie-info.model';
import { MatSort } from '@angular/material/sort';

import * as WatchlistActions from './store/watchlist.actions';


@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  watchlistMovies: Observable<{ films: movieInfo[] }>;
  
  tableView = true;
  tableDisplayCols = ['title', 'director', 'date', 'rating', 'options'];

  constructor(
    private store: Store<fromApp.AppState> 
  ) { }

  ngOnInit(): void {
    this.watchlistMovies = this.store.select('watchlist');
  }

  switchView() {
    this.tableView = !this.tableView;
    console.log(this.tableView ? 'switched to table view' : 'switched to watchlist view');
  }

  getDirector(film: movieInfo) {
    if (film.movieCrew.crew.map(el => el.job).includes('Director')) {
      return film.movieCrew.crew.filter(person =>  person.job === 'Director')[0].name;
    } else { return 'n/a' }
  }

  getReleaseDate(film: movieInfo) {
    if (film.movieDetails.release_date) {
      const date = new Date(film.movieDetails.release_date);
      return date.toLocaleDateString('en-us', { year:"numeric", month:"long", day:"numeric"})
    } else { return 'n/a' }
  }

  getRating(film: movieInfo) {
    return Math.round(film.movieDetails?.score * 100) / 100; 
  }

  removeWatchlistItem(film: movieInfo) {
    this.store.dispatch(new WatchlistActions.RemoveFromWatchlist(film.movieDetails.id));
  }
  
}
