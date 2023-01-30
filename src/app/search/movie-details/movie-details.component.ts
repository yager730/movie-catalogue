import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import * as WatchlistActions from '../../watchlist/store/watchlist.actions';

import * as fromApp from '../../store/app.reducer';
import { MovieCrew, MovieDetails } from '../../shared/movie-info.model';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  detailsLoaded = true;
  
  @Input() movie: number;
  movieInfoSubscription: Subscription;
  watchlistSubscription: Subscription;
  authSubscription: Subscription;

  movieDetails: MovieDetails;
  movieCrew: MovieCrew;
  movieImages: string [];

  userLoggedIn: boolean;
  onWatchlist: boolean;
  director: string;
  rating: number;
  
  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.movieInfoSubscription = this.store.select('search')
    .pipe(map(searchState => searchState))
    .subscribe((results) => {
      this.detailsLoaded = results.movieDataLoading;
      this.movieDetails = results.movieInfo.movieDetails;
      this.movieCrew = results.movieInfo.movieCrew;
      this.movieImages = results.movieInfo.movieImagePaths;
      this.director = results.movieInfo.movieCrew?.crew.map(el => el.job).includes('Director') ? 
        results.movieInfo.movieCrew?.crew.filter(el => el.job === 'Director')[0].name : 'n/a';
      this.rating = Math.round(results.movieInfo.movieDetails?.score * 100) / 100;
    });
    this.watchlistSubscription = this.store.select('watchlist')
    .pipe(map(watchlistState => watchlistState))
    .subscribe((results) => {
      this.onWatchlist = results.films.map(el => el.movieDetails.id).includes(this.movie);
    });
    this.authSubscription = this.store.select('auth')
    .pipe(map(authState => authState))
    .subscribe((results) => {
      this.userLoggedIn = !!results.user
    })
  }

  addToWatchlist() {
    this.store.dispatch(new WatchlistActions.AddToWatchlist({
      movieDetails: this.movieDetails,
      movieCrew: this.movieCrew,
      movieImagePaths: this.movieImages
    }));
  }

  doesNothing() { }

  ngOnDestroy(): void {
    this.movieInfoSubscription.unsubscribe();
    this.watchlistSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }
}
