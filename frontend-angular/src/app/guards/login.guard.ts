import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivateChild {

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) { }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const role = this.tokenStorageService.getRole();
    const token = this.tokenStorageService.getToken();

    if (token && (
      role === 'ROLE_STUDENT' || role === 'ROLE_ADVISOR' || role === 'ROLE_ADMIN'
    )) {
      this.router.navigate(['']);
      return false;
    }

    return true;
  }

}
