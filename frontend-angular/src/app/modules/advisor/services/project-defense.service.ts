import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ProjectDefenseRequest } from 'src/app/interfaces/project/project-defense';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectDefenseService {

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
    let msg = `error code: ${err.status}, body: ${typeof err.error === 'string' ? err.error : err.error.error}`
    return throwError(() => msg);
  }
  
  getProjectDefenseRequestList() {
    const apiUrl = `http://localhost:8080/api/advisor/project-defense-requests`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateProjectDefense(requestId: number, payload: Partial<ProjectDefenseRequest>) {
    const apiUrl = `http://localhost:8080/api/advisor/project-defense-request/${requestId}`;
    return this.http.patch<any>(apiUrl, payload, this.httpOptions).pipe(catchError(this.handleError));
  }
}
