import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpDownloadProgressEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, EMPTY, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { TokenHelper } from '../_common';

@Injectable()

export class AuthHttpInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var d = new Date();
        var timeZoneName = d.toLocaleString('en', { timeZoneName: 'short' }).split(' ').pop();

        let authReq = req.clone({
            headers: req.headers
                .set('Content-Type', 'application/json')
                .set('X-XSRF-TOKEN', `${this.getCookie('XSRF-TOKEN')}`)
                .set('Time-Zone', d.getTimezoneOffset().toString())
                .set('app-prefix', 'backend')
                .set('Access-Control-Allow-Origin', '*')
        });

        let token = TokenHelper.getAccessToken();
        if (token) {
            authReq = authReq.clone({
                headers: authReq.headers
                    .set('Authorization', 'Bearer ' + token)
            });
        }

        return next.handle(authReq).pipe(
            catchError(err => {
                console.error('interceptor error ---- ' + JSON.stringify(err));
                if (err.status == 401) {
                    this.router.navigate(['/login'], { skipLocationChange: true });

                    // this.router.navigate(['/authentication-required'], { skipLocationChange: true });
                    return EMPTY;
                } else if (err.status == 0 || err.status == 502) {
                    this.router.navigate(['/something-wrong'], { skipLocationChange: true });
                    return EMPTY;
                }
                else {
                    // this.router.navigate(['/something-wrong'], { skipLocationChange: true });
                    return throwError(err);
                }
            })
        )
    }
    public getCookie(name: string): string {
        const nameLenPlus = (name.length + 1);
        return document.cookie
            .split(';')
            .map(c => c.trim())
            .filter(cookie => {
                return cookie.substring(0, nameLenPlus) === `${name}=`;
            })
            .map(cookie => {
                return decodeURIComponent(cookie.substring(nameLenPlus));
            })[0] || null;
    }
}
