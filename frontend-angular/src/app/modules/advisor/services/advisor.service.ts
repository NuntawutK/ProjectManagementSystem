import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { Advisor } from 'src/app/interfaces/user/advisor';

import { TokenStorageService } from 'src/app/services/token-storage.service';

@Injectable({
  providedIn: 'any'
})
export class AdvisorService {

  advisor: Advisor | undefined;

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenStorageService.getToken()}`,
    })
  };

  private handleError(err: HttpErrorResponse) {
    let msg = `error code: ${err.status}, body: ${err.error}`
    return throwError(() => msg);
  }

  getAdvisor() {
    const apiUrl = 'http://localhost:8080/api/advisor/user';
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      map(res => {
        this.advisor = res;
        return this.advisor;
      }),
      catchError(this.handleError)
    );
  }

  loadAdvisor() {
    return this.advisor;
  }

}
