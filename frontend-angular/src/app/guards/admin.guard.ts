import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const url: string = route.url[0].path;

    const role = this.tokenStorageService.getRole();
    const token = this.tokenStorageService.getToken();

    if (!token) {
      this.router.navigateByUrl('/login');
      return false;
    }
    

    if (role === 'ROLE_ADMIN' && url === 'admin') {
      return true;
    }

    this.router.navigateByUrl('/unauthorized', { skipLocationChange: true });
    return false;
  }
  
}
