import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchComponent } from "./search.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { MovieResultsListComponent } from './movie-results-list/movie-results-list.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes =[
    { path: '', component: SearchComponent }
];

@NgModule({
    declarations: [
        SearchComponent,
        MovieDetailsComponent,
        MovieResultsListComponent,
    ],
    imports: [
        SharedModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ]
})
export class SearchModule {}
