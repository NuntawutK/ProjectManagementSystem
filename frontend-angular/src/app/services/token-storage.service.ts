import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  clear(): void {
    window.localStorage.clear();
    window.location.href = '/';
  }

  saveToken(token: string): void {
    window.localStorage.setItem('token', token);
  }

  getToken() {
    return window.localStorage.getItem('token');
  }

  saveRole(role: string): void {
    window.localStorage.setItem('role', role);
  }

  getRole() {
    return window.localStorage.getItem('role');
  }
  
}
