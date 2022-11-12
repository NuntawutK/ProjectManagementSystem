import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ProjectMeeting } from 'src/app/interfaces/project/project-meeting';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Injectable({
  providedIn: 'any'
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

  updateProjectMeeting(id: number, payload: Partial<ProjectMeeting>) {
    const apiUrl = `http://localhost:8080/api/advisor/project-meeting/${id}`;
    return this.http.patch<any>(apiUrl, payload, this.httpOptions).pipe(catchError(this.handleError));
  }
}
