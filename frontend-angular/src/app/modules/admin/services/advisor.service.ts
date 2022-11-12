import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { Advisor } from "src/app/interfaces/user/advisor";
import { TokenStorageService } from "src/app/services/token-storage.service";

@Injectable({
  providedIn: 'any'
})
export class AdvisorService {

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

  createAdvisor(advisor: Partial<Advisor>) {
    const apiUrl = 'http://localhost:8080/api/admin/advisor';
    return this.http.post<any>(apiUrl, advisor, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createAdvisorList(advisorList: Partial<Advisor>[]) {
    const apiUrl = 'http://localhost:8080/api/admin/advisors';
    return this.http.post<any>(apiUrl, advisorList, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getAdvisorList() {
    const apiUrl = 'http://localhost:8080/api/admin/advisors';
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

}