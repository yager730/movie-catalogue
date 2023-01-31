import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs';
import { movieInfo } from 'src/app/shared/movie-info.model';
import { ReviewsService } from './review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
  providers: [ReviewsService]
})
export class ReviewComponent implements OnInit {
  
  loadingPage: boolean = true;
  apiError: boolean = false;
  
  movie: movieInfo;

  constructor(private ReviewsService: ReviewsService, private router: Router) {};

  ngOnInit() {
    // 99% of time users will navigate to this page via button press, which pass along movieInfo
    if (history.state['movieInfo']) {
      this.loadingPage = false;
      this.movie = history.state['movieInfo']
    } else {
      console.log('Navigated to page directly, fetching data...')
      this.ReviewsService.fetchMovieData(location.href.split('/').pop())
      .pipe(take(1)).subscribe(results => {
        this.loadingPage = false;
        if (typeof(results) === 'string') {
          this.apiError = true
        } else { this.movie = results; }
      });
    }
  }

  onAcknowledgeError() {
    this.router.navigate(['reviews']);
  }

}