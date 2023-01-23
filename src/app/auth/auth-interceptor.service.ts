import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { exhaustMap, map, take } from "rxjs";
import { AuthService } from "./auth.service";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    
    constructor(private authService: AuthService, private store: Store<fromApp.AppState>){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (req.url.includes('firebase')) {
            return this.store.select('auth').pipe(
                take(1),
                map(authState => {
                    return authState.user;
                }),
                exhaustMap(user => {
                    if (!user) { return next.handle(req); }
                    const modReq = req.clone({params: new HttpParams().set('auth', user.token)});
                    return next.handle(modReq);
                })
            );
        } else { return next.handle(req) }
    }
}