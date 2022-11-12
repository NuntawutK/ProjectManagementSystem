import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectStudentService {

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

  getProjectForGradingList() {
    const apiUrl = 'http://localhost:8080/api/admin/projects/grade';
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getProjectStatusList() {
    const apiUrl = 'http://localhost:8080/api/admin/project-statuses';
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

}
