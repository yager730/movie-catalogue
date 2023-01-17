import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WatchlistComponent } from "./watchlist.component";
import { SharedModule } from '../shared/shared.module';

const routes: Routes =[
    { path: '', component: WatchlistComponent }
];

@NgModule({
    declarations: [
        WatchlistComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class WatchlistModule {}