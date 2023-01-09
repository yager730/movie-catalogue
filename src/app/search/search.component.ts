import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environments';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  search: FormGroup;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.search = new FormGroup({
      'searchTerm': new FormControl(null)
    })
  }

  onSubmit() {
    console.log(this.searchService.search(this.search.value.searchTerm).subscribe({
      next: (responseData) => {
          console.log(responseData);
          // this.isLoading = false;
          // this.router.navigate(['/recipes']);
      },
      error: (errorMessage) => {
          console.log(errorMessage);
          // this.error = errorMessage;
          // this.isLoading = false;
      }
    }));
  }
}
