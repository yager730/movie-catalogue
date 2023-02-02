import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { SharedModule } from "../shared/shared.module";
import { ReviewsListComponent } from "./reviews-list.component";
import { ReviewComponent } from "./review/review.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ReviewFormComponent } from "./review-form/review-form.component";

const routes: Routes = [
    { path: '', component: ReviewsListComponent, canActivate: [AuthGuard] },
    { path: "id/:id", component: ReviewComponent, canActivate: [AuthGuard] },
    { path: '**', canActivate: [AuthGuard], redirectTo: '' }
];

@NgModule({
    declarations: [
        ReviewsListComponent,
        ReviewComponent,
        ReviewFormComponent
    ],
    imports: [
        SharedModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ]
})
export class ReviewsListModule {}
