import { Component, OnInit } from "@angular/core";
import { AcademicNameTitle } from "src/app/interfaces/user/academic-name-title";
import { Advisor } from "src/app/interfaces/user/advisor";
import { NameTitle } from "src/app/interfaces/user/name-title";
import { AdvisorService } from "./services/advisor.service";

@Component({
  selector: 'app-advisor',
  templateUrl: './advisor.component.html'
})
export class AdvisorComponent implements OnInit {

  advisor!: Advisor; 

  constructor(
    private advisorService: AdvisorService
  ) { }

  ngOnInit(): void {
    this.advisorService.getAdvisor().subscribe({
      next: res => {
        if (res?.id) {
          this.advisor = res;
        } else {
          console.error('cannot get advisor data');
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }
  
}