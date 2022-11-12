import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

export interface ConfigInterface {
  currentAcademicYearSemester: {
    year: number;
    semester: number;
  };
  maxProjectMeetingItem: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config: ConfigInterface | undefined;

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
  
  getConfig() {
    return this.http.get('http://localhost:8080/api/config', this.httpOptions).pipe(
      map((res: any) => {
        this.config = res;
        return this.config;
      }),
      catchError(this.handleError)
    );
  }

  saveConfig(appConfig: ConfigInterface | undefined) {
    return this.http.post('http://localhost:8080/api/config', appConfig, this.httpOptions).pipe(catchError(this.handleError));
  }

  loadConfig() {
    return this.config;
  }
}
