import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Project } from 'src/app/interfaces/project/project';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Injectable({
  providedIn: 'any'
})
export class ProjectStudentService {

  selectedProject!: Project;

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

  getProjectStudentList() {
    const apiUrl = `http://localhost:8080/api/student/project-student`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  setProject(project: Project) {
    this.selectedProject = project;
  }

  getSelectedProject() {
    return this.selectedProject;
  }

}
