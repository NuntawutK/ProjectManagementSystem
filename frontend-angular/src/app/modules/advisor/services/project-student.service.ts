import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectStudentMeetingService {

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

  getProjectStudentMeetingList() {
    const apiUrl = `http://localhost:8080/api/advisor/project-students`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getProjectStudentByProjectId(projectId: number) {
    const apiUrl = `http://localhost:8080/api/advisor/project-student/${projectId}`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}
