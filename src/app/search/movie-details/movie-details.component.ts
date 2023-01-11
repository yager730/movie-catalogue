import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { MovieCrew, MovieDetails, MovieImages } from '../movie-data.model';

import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  @Input() movie: number;
  subscription: Subscription;
  movieDetails: MovieDetails;
  movieCrew: MovieCrew;
  movieImages: MovieImages;

  director: string;
  rating: number;
  
  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscription = this.store.select('search')
    .pipe(map(searchState => searchState))
    .subscribe((results) => {
      this.movieDetails = results.movieInfo.movieDetails;
      this.movieCrew = results.movieInfo.movieCrew;
      this.movieImages = results.movieInfo.movieImages;
      this.director = results.movieInfo.movieCrew?.crew.filter(el => el.job === 'Director')[0].name;
      this.rating = Math.round(results.movieInfo.movieDetails?.score * 100) / 100;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
