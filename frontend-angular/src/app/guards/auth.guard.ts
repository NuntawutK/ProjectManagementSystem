import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) { }
  
  canActivate(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const role = this.tokenStorageService.getRole();
    const token = this.tokenStorageService.getToken();

    if (!token) {
      this.router.navigateByUrl('/login');
      return false;
    }

    if (!role) {
      this.router.navigateByUrl('/login');
      return false;
    } 
    else {
      switch (role) {
        case 'ROLE_ADMIN':
          this.router.navigate(['/admin']);
          break;
        case 'ROLE_ADVISOR':
          this.router.navigate(['/advisor']);
          break;
        case 'ROLE_STUDENT':
          this.router.navigate(['/student']);
          break;
      }
    }

    return true;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (!this.tokenStorageService.getToken()) {
      this.router.navigateByUrl('/login');
      return false;
    }
  
    return true;
  
  }
  
}
