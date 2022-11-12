import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ProjectDefenseFileStorage, ProjectDefenseRequest } from 'src/app/interfaces/project/project-defense';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectDefenseService {

  projectDefenseRequestList!: ProjectDefenseRequest[];
  fileNameList!: ProjectDefenseFileStorage[]
  
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

  createProjectDefenseRequest(projectDefenseRequest: Partial<ProjectDefenseRequest>) {
    const apiUrl = `http://localhost:8080/api/student/project-defense-request`;
    return this.http.post<any>(apiUrl, projectDefenseRequest, this.httpOptions).pipe(catchError(this.handleError));
  }

  getProjectDefenseRequestList() {
    const apiUrl = `http://localhost:8080/api/student/project-defense-requests`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateProjectDefenseRequest(projectDefenseRequest: Partial<ProjectDefenseRequest>) {
    const apiUrl = `http://localhost:8080/api/student/project-defense-request/upload`;
    return this.http.patch<any>(apiUrl, projectDefenseRequest, this.httpOptions).pipe(catchError(this.handleError));
  }

  getFileNameList(projectDefenseRequestId: number) {
    const apiUrl = `http://localhost:8080/api/student/project-defense-requests/${projectDefenseRequestId}/file-name`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  openSubmittedFiles(index: number) {
    const apiUrl = `http://localhost:8080/api/student/project-defense-file-storage/${index}`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteSubmittedFiles(index: number) {
    const apiUrl = `http://localhost:8080/api/student/project-defense-file-storage/${index}`;
    return this.http.delete<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

}
