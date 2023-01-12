import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as WatchlistActions from './store/watchlist.actions';
import * as fromApp from '../store/app.reducer';
import { SearchResult } from '../search/search-result.model';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  watchlistMovies: Observable<{ films: SearchResult[] }>;
  // private igChangeSub: Subscription;

  constructor(
    private store: Store<fromApp.AppState> 
  ) { }

  ngOnInit(): void {
    this.watchlistMovies = this.store.select('watchlist');
  }
}
