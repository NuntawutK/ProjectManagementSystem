import { Component, Input, OnInit } from '@angular/core';

// interfaces
import { Advisor } from 'src/app/interfaces/user/advisor';

// services
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  @Input() advisor: Advisor | undefined;

  constructor(
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.tokenStorage.clear();
  }

}
