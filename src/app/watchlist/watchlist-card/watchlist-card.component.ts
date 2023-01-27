import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { movieInfo } from 'src/app/shared/movie-info.model';
import * as fromApp from '../../store/app.reducer';
import * as WatchlistActions from '../store/watchlist.actions';

@Component({
  selector: 'app-watchlist-card',
  templateUrl: './watchlist-card.component.html',
  styleUrls: ['./watchlist-card.component.css'],
})
export class WatchlistCardComponent {
    
    @Input() film: movieInfo;
    posterLoaded = false;
    
    constructor(private store: Store<fromApp.AppState>) {}
 
    removeWatchlistItem(film: movieInfo) {
        this.store.dispatch(new WatchlistActions.RemoveFromWatchlist(film.movieDetails.id));
    }

    onImageLoad() {
        this.posterLoaded = true;
    }
}