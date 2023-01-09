import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReviewsComponent } from "./reviews.component";

const routes: Routes =[
    { path: '', component: ReviewsComponent }
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