import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieResultsListComponent } from './movie-results-list.component';

describe('MovieResultsListComponent', () => {
  let component: MovieResultsListComponent;
  let fixture: ComponentFixture<MovieResultsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieResultsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieResultsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
