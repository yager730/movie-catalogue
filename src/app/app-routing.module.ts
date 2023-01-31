import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    { path: '', redirectTo: '/search', pathMatch: 'full' },
    { path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchModule) },
    { path: 'reviews', loadChildren: () => import('./reviews-list/reviews-list.module').then(m => m.ReviewsListModule) },
    { path: 'watchlist', loadChildren: () => import('./watchlist/watchlist.module').then(m => m.WatchlistModule) },
    { path: '**', redirectTo: '/search'}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule {

}