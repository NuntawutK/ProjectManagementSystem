import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";
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
      'Authorization': `Bearer ${this.tokenStorageService.getToken()}`,
    })
  };

  private handleError(err: HttpErrorResponse) {
    let msg = `error code: ${err.status}, body: ${err.error}`
    return throwError(() => msg);
  }

  getStudentList() {
    const apiUrl = `http://localhost:8080/api/advisor/students?getMode=GET_ALL_STUDENT`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  
  getStudentForCreateProject() {
    const apiUrl = `http://localhost:8080/api/advisor/students?getMode=CREATING_NEW_PROJECT`;
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}