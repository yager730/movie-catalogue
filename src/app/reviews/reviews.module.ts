import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { ReviewsComponent } from "./reviews.component";

const routes: Routes =[
    { path: '', component: ReviewsComponent, canActivate: [AuthGuard] }
];

@NgModule({
    declarations: [
        ReviewsComponent
    ],
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class ReviewsModule {}