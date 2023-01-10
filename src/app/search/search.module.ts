import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchComponent } from "./search.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from "@angular/forms";
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { MovieResultsListComponent } from './movie-results-list/movie-results-list.component';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";

const routes: Routes =[
    { path: '', component: SearchComponent }
];

@NgModule({
    declarations: [
        SearchComponent,
        MovieDetailsComponent,
        MovieResultsListComponent
    ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ]
})
export class SearchModule {}
