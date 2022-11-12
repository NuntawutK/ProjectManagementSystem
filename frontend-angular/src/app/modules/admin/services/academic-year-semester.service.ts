import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AcademicYearSemesterService {

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

  getAcademicYearList() {
    const apiUrl = 'http://localhost:8080/api/admin/academic-years';
    return this.http.get<any>(apiUrl, this.httpOptions).pipe(catchError(
      this.handleError)
    );
  }
  
}
