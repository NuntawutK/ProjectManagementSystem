import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ProjectMeeting } from 'src/app/interfaces/project/project-meeting';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectMeetingService {

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

  createProjectMeeting(projectMeeting: Partial<ProjectMeeting>[]) {
    const apiUrl = `http://localhost:8080/api/student/project-meetings`;
    return this.http.post<any>(apiUrl, projectMeeting, this.httpOptions).pipe(catchError(this.handleError));
  }

  getProjectMeetingList(projectStudentId: number) {
    const apiUrl = `http://localhost:8080/api/student/project-meetings/project-student/${projectStudentId}`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  
}
