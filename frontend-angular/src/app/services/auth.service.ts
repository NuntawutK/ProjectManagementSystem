import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  private handleError(err: HttpErrorResponse) {
    let msg = `error code: ${err.status}, body: ${err.error}`
    return throwError(() => msg);
  }

  login(payload: any) {
    let apiUrl = 'http://localhost:8080/api/login/user';
    return this.http.post<any>(apiUrl, payload, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  loginAdmin(payload: any) {
    let apiUrl = 'http://localhost:8080/api/login/admin';
    return this.http.post<any>(apiUrl, payload, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

}
