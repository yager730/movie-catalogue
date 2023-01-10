import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { MovieDetails } from '../movie-data.model';

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
  
  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscription = this.store.select('search')
    .pipe(map(searchState => searchState))
    .subscribe((results) => {
      this.movieDetails = results.movieDetails;
    });
  }

  ngOnDestroy(): void {
    
  }
}
