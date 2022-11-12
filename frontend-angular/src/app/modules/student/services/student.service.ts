import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { Student } from 'src/app/interfaces/user/student';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Injectable({
  providedIn: 'any'
})
export class StudentService {

  student: Student | undefined;

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
    let msg = `error code: ${err.status}, body: ${err.error === 'string'}`
    return throwError(() => msg);
  }

  getStudent() {
    const apiUrl = `http://localhost:8080/api/student/user`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      map(res => {
        this.student = res;
        return this.student;
      }),
      catchError(this.handleError)
    )
  }

  loadStudent() {
    return this.student;
  }
  
}
