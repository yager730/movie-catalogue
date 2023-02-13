import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { elementAt, map, Subscription } from 'rxjs';
import * as WatchlistActions from '../../watchlist/store/watchlist.actions';

import * as fromApp from '../../store/app.reducer';
import { MovieCrew, MovieDetails } from '../../shared/movie-info.model';
import { Router } from '@angular/router';
import { Palette } from 'node-vibrant/lib/color';

const Vibrant = require('node-vibrant');

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  detailsLoaded: boolean;
  posterLoaded: boolean;
  
  @Input() movie: number;
  movieInfoSubscription: Subscription;
  watchlistSubscription: Subscription;
  reviewsSubscription: Subscription;
  authSubscription: Subscription;

  posterColor: string;
  overviewHeaders: string;

  movieDetails: MovieDetails;
  movieCrew: MovieCrew;
  movieImages: string [];

  userLoggedIn: boolean;
  onWatchlist: boolean;
  inReviewsList: boolean;
  director: string;
  rating: number;
  
  constructor(private store: Store<fromApp.AppState>, private router: Router) {}

  ngOnInit() {
    this.posterLoaded = false;
    this.movieInfoSubscription = this.store.select('search')
    .pipe(map(searchState => searchState))
    .subscribe((results) => {
      console.log(this.detailsLoaded)
      this.detailsLoaded = !results.movieDataLoading;
      this.movieDetails = results.movieInfo.movieDetails;
      this.movieCrew = results.movieInfo.movieCrew;
      this.movieImages = results.movieInfo.movieImagePaths;
      this.director = results.movieInfo.movieCrew?.crew.map(el => el.job).includes('Director') ? 
        results.movieInfo.movieCrew?.crew.filter(el => el.job === 'Director')[0].name : 'n/a';
      this.rating = Math.round(results.movieInfo.movieDetails?.score * 100) / 100;
      this.setBackgroundGradient(this.movieDetails?.poster);
    });
    this.watchlistSubscription = this.store.select('watchlist')
    .pipe(map(watchlistState => watchlistState))
    .subscribe((results) => {
      this.onWatchlist = results.films.map(el => el.movieDetails.id).includes(this.movie);
    });
    this.reviewsSubscription = this.store.select('reviews')
    .pipe(map(reviewsListState => reviewsListState))
    .subscribe((results) => {
      console.log(results);
      this.inReviewsList = results.reviewsList.map(el => el.movieDetails.id).includes(this.movie);
    });
    this.authSubscription = this.store.select('auth')
    .pipe(map(authState => authState))
    .subscribe((results) => {
      this.userLoggedIn = !!results.user
    })
  }

  hasMovieReleased(releaseDate: string) {
    return new Date() >= new Date(releaseDate);
  }

  goToAddReview() {
    this.router.navigate([`reviews/id/${this.movieDetails.id}`], {state: {
      movieInfo: {
        movieDetails: this.movieDetails,
        movieCrew: this.movieCrew,
        movieImages: this.movieImages }
    }});
  }

  goToUserReviews() {
    this.router.navigate([`reviews/id/${this.movieDetails.id}`]);
  }

  addToWatchlist() {
    this.store.dispatch(new WatchlistActions.AddToWatchlist({
      movieDetails: this.movieDetails,
      movieCrew: this.movieCrew,
      movieImagePaths: this.movieImages
    }));
  }

  setBackgroundGradient(imageURL: string) {
    if (imageURL) {
      Vibrant.from(this.movieDetails.poster).getPalette().then((palette: Palette) => { 
        this.posterColor = `linear-gradient( ${palette.DarkMuted.hex}cc, ${palette.Vibrant.hex}cc, ${palette.DarkVibrant.hex}cc`;
        // this.overviewHeaders = `linear-gradient( to right, ${palette.DarkVibrant.hex}cc, #424242)`;
        this.posterLoaded = true;
      });
    } else {
      this.posterLoaded = true;
    }
  }

  ngOnDestroy(): void {
    this.movieInfoSubscription.unsubscribe();
    this.watchlistSubscription.unsubscribe();
    this.reviewsSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }
}
