import { Component, OnInit } from '@angular/core';

// interfaces
import { AcademicNameTitle } from 'src/app/interfaces/user/academic-name-title';
import { Advisor } from 'src/app/interfaces/user/advisor';
import { NameTitle } from 'src/app/interfaces/user/name-title';

// services
import { AdvisorService } from '../../services/advisor.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  
  constructor(
    private advisorService: AdvisorService
  ) { }

  ngOnInit(): void {
  }

  loadAdvisor() {
    return this.advisorService.loadAdvisor();
  }

  get firstName() { return this.loadAdvisor()?.firstName; }
  get lastName() { return this.loadAdvisor()?.lastName; }
  get academicNameTitle() { return this.loadAdvisor()?.academicNameTitle; }
  get nameTitle() { return this.loadAdvisor()?.nameTitle; }

}
