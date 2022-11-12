import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, throwError } from "rxjs";
import { Student } from "src/app/interfaces/user/student";
import { TokenStorageService } from "src/app/services/token-storage.service";

@Injectable({
  providedIn: 'any'
})
export class StudentService {

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenStorageService.getToken()}`
    })
  };

  private handleError(err: HttpErrorResponse) {
    let msg = `error code: ${err.status}, body: ${err.error}`
    return throwError(() => msg);
  }
  
  createStudent(student: Partial<Student>) {
    const apiUrl = 'http://localhost:8080/api/admin/student';
    return this.http.post<any>(apiUrl, student, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createStudentList(studentList: Partial<Student>[]) {
    const apiUrl = 'http://localhost:8080/api/admin/students';
    return this.http.post<any>(apiUrl, studentList, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getStudentList() {
    const apiUrl = 'http://localhost:8080/api/admin/students';
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getStudentForGradingList() {
    const apiUrl = 'http://localhost:8080/api/admin/students/grade';
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}