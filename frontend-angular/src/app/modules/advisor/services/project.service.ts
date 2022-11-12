import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Project } from 'src/app/interfaces/project/project';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Injectable({
  providedIn: 'any'
})
export class ProjectService {

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

  createStudentProject(project: Partial<Project>) {
    const apiUrl = 'http://localhost:8080/api/advisor/project';
    return this.http.post<any>(apiUrl, project, this.httpOptions).pipe(catchError(this.handleError));
  }

  getStudentProject(academicYear: number, semester: number) {
    const apiUrl = `http://localhost:8080/api/advisor/projects/${academicYear}/${semester}`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  
  getOnGoingStudentProject() {
    const apiUrl = `http://localhost:8080/api/advisor/projects/ongoing`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getProject(id: number) {
    const apiUrl = `http://localhost:8080/api/advisor/project/${id}`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  
}
