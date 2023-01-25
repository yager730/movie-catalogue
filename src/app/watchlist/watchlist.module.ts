import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WatchlistComponent } from "./watchlist.component";
import { WatchlistCardComponent } from "./watchlist-card/watchlist-card.component";
import { SharedModule } from '../shared/shared.module';
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

const routes: Routes =[
    { path: '', component: WatchlistComponent }
];

@NgModule({
    declarations: [
        WatchlistComponent,
        WatchlistCardComponent
    ],
    imports: [
        NgxSkeletonLoaderModule,
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class WatchlistModule {}