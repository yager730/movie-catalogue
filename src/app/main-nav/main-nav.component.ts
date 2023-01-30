import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, OnDestroy {
  authSubscription: Subscription;
  userLoggedIn: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(private breakpointObserver: BreakpointObserver, private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.authSubscription = this.store.select('auth')
    .pipe(map(authState => authState))
    .subscribe((results) => {
      this.userLoggedIn = !!results.user;
    });    
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe()
  }
}
