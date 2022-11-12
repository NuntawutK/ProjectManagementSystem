import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-admin-login-page',
  templateUrl: './admin-login-page.component.html'
})
export class AdminLoginPageComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {
  }

  onClick() {
    this.authService.loginAdmin(this.loginForm.value).subscribe({
      next: res => {
        this.tokenStorageService.saveToken(res.token);
        this.tokenStorageService.saveRole(res.role);
        window.location.href = "";
      },
      error: _ => {
        alert('Username or Password incorrect!');
      }
    });
  }

}
