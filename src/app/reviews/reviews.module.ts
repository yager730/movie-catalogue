import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { SharedModule } from "../shared/shared.module";
import { ReviewAddComponent } from "./review-add/review-add.component";
import { ReviewEditComponent } from "./review-edit/review-edit.component";
import { ReviewsComponent } from "./reviews.component";

const routes: Routes = [
    { path: '', component: ReviewsComponent, canActivate: [AuthGuard] },
    { path: 'new', component: ReviewAddComponent, canActivate: [AuthGuard] },
    { path: 'edit/:id', component: ReviewEditComponent, canActivate: [AuthGuard] }
];

@NgModule({
    declarations: [
        ReviewsComponent,
        ReviewAddComponent,
        ReviewEditComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class ReviewsModule {}