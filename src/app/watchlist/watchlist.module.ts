import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WatchlistComponent } from "./watchlist.component";
import { MatListModule } from "@angular/material/list"

const routes: Routes =[
    { path: '', component: WatchlistComponent }
];

@NgModule({
    declarations: [
        WatchlistComponent
    ],
    imports: [
        CommonModule,
        MatListModule,
        RouterModule.forChild(routes)
    ]
})
export class WatchlistModule {}