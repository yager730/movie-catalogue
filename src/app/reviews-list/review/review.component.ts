import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { map, take } from 'rxjs';
import { movieInfo } from 'src/app/shared/movie-info.model';
import { ReviewsService } from './review.service';
import * as Utils from '../../shared/utils';

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

  editMode: boolean = false;
  reviewDataForUser: boolean;

  reviewForm: FormGroup;

  constructor(private ReviewsService: ReviewsService, private router: Router) {};

  ngOnInit() {
    this.reviewForm = new FormGroup({
      reviewText: new FormControl(),
      rating: new FormControl(),
      dateWatched: new FormControl()
    });

    // 99% of time users will navigate to this page via button press, which pass along movieInfo
    if (history.state['movieInfo']) {
      this.loadingPage = false;
      this.movie = history.state['movieInfo'];
      // Will need a more robust check here once I actually am able to save reviews
      this.editMode = true;
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

    this.reviewDataForUser = this.checkForReview(this.movie.movieDetails.id)

  }

  checkForReview(id: number): boolean {
    return false;
  }

  addReview() {
    this.editMode = true;
  }

  goBackToReviews() {
    this.router.navigate(['reviews']);
  }

  getDirector(film: movieInfo) { return Utils.getDirector(film) };
  getReleaseDate(film: movieInfo) { return Utils.getReleaseDate(film) };
  getRating(film: movieInfo) { return Utils.getRating(film) };

  onSubmit() {
    console.log(this.reviewForm.value);
    return;
  }

  handleCancel() {
    this.editMode = false;
  }

}