import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { MainNavComponent } from './main-nav/main-nav.component';
import { AuthComponent } from './auth/auth.component';

import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromApp from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { SearchEffects } from './search/store/search.effects';
import { WatchlistEffects } from './watchlist/store/watchlist.effects';
import { environment } from 'src/environments/environments';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    AuthComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule,
    SharedModule,
    StoreModule.forRoot(fromApp.appReducer),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    EffectsModule.forRoot([AuthEffects, SearchEffects, WatchlistEffects]),
    NgbModule
  ],
  providers: [ {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
