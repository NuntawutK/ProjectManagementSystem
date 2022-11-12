import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, map, catchError } from 'rxjs';
import { Grade } from 'src/app/models/project/project-result.model';
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
    let msg = `error code: ${err.status}, body: ${err.error}`
    return throwError(() => msg);
  }

  getGradeList() {
    const apiUrl = 'http://localhost:8080/api/admin/grades';
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}
