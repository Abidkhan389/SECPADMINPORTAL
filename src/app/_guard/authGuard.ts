import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, CanLoad, Route } from "@angular/router";
import { Observable } from "rxjs";
import { TokenHelper } from "../_common";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        window.scrollTo(0, 0);
        let token = TokenHelper.getAccessToken();
        if (!token) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        }
        return true;
    }

    canLoad(route: Route): boolean {
        window.scrollTo(0, 0);
        let token = TokenHelper.getAccessToken();
        if (token) {
            return true;
        }
        else if (!token) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: route.path } });
            return true;
        }
        else {
            this.router.navigate([route.path ? route.path : '/main']);
            return false;
        }
    }


}