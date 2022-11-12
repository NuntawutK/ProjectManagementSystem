import { Component, Input, OnInit } from '@angular/core';
import { Student } from 'src/app/interfaces/user/student';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  @Input() student: Student | undefined;

  constructor(private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.tokenStorage.clear();
  }

}
