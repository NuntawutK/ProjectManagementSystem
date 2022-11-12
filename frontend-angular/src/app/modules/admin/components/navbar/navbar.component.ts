import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  constructor(
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.tokenStorage.clear();
  }

}
