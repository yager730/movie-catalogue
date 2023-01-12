import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import { movieInfo } from '../shared/movie-info.model';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  watchlistMovies: Observable<{ films: movieInfo[] }>;
  // private igChangeSub: Subscription;

  constructor(
    private store: Store<fromApp.AppState> 
  ) { }

  ngOnInit(): void {
    this.watchlistMovies = this.store.select('watchlist');
  }
}
