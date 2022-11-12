import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ProjectDefenseResult } from 'src/app/interfaces/project/project-result';

@Injectable({
  providedIn: 'root'
})
export class ProjectResultService {

  
  projectResults!: ProjectDefenseResult[];

  constructor(
    private http: HttpClient,
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    })
  };
  private handleError(err: HttpErrorResponse) {
    let msg = `error code: ${err.status}, body: ${typeof err.error === 'string' ? err.error : err.error.error}`
    return throwError(() => msg);
  }

  createProjectResult(payload: Partial<ProjectDefenseResult>[]) {
    const apiUrl = 'http://localhost:8080/api/admin/project-defense-result';
    return this.http.post<any>(apiUrl, payload, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getProjectDefenseResultByAcademicYearSemester(year: number, semester: number) {
    const apiUrl = `http://localhost:8080/api/admin/project-defense-results/${year}/${semester}`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}
