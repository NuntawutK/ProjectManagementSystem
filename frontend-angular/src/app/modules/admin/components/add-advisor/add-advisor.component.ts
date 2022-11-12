import { Component, OnInit } from "@angular/core";

// interfaces
import { AcademicNameTitle } from "src/app/interfaces/user/academic-name-title";
import { NameTitle } from "src/app/interfaces/user/name-title";
import { Advisor } from "src/app/interfaces/user/advisor";

// services
import { AcademicNameTitleService } from "../../services/academic-name-title.service";
import { NameTitleService } from "../../services/name-title.service";
import { AdvisorService } from "../../services/advisor.service";

@Component({
  selector: 'app-add-advisor',
  templateUrl: './add-advisor.component.html'
})
export class AddAdvisorComponent implements OnInit {

  nameTitleList!: NameTitle[];
  acadNameTitleList!: AcademicNameTitle[];
  advisorList!: Advisor[];
  
  constructor(
    private nameTitleService: NameTitleService,
    private acadNameTitleService: AcademicNameTitleService,
    private advisorService: AdvisorService
  ) { }

  ngOnInit(): void {
    this.getNameTitleList();
    this.getAcademicNameTitleList();
  }

  clickToGetAdvisor() {
    this.getAdvisorList();
  }

  getNameTitleList() {
    this.nameTitleService.getNameTitleList().subscribe({
      next: data => {
        this.nameTitleList = data;
      },
      error: err => {
        console.error(err);
      }
    });
  };

  getAcademicNameTitleList() {
    this.acadNameTitleService.getAcademicNameTitleList().subscribe({
      next: data => {
        this.acadNameTitleList = data;
      },
      error: err => {
        console.error(err);
      }
    });
  };

  getAdvisorList() {
    this.advisorService.getAdvisorList().subscribe({
      next: data => {
        this.advisorList = data;
      },
      error: err => {
        console.error(err);
      }
    });
  };
}