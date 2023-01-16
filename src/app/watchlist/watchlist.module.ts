import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WatchlistComponent } from "./watchlist.component";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSortModule } from "@angular/material/sort";

const routes: Routes =[
    { path: '', component: WatchlistComponent }
];

@NgModule({
    declarations: [
        WatchlistComponent
    ],
    imports: [
        CommonModule,
        MatTableModule,
        MatCardModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatIconModule,
        MatSortModule,
        RouterModule.forChild(routes)
    ]
})
export class WatchlistModule {}