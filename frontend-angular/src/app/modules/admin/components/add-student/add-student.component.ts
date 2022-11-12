import { Component, OnInit } from "@angular/core";

// interfaces
import { Advisor } from "src/app/interfaces/user/advisor";
import { NameTitle } from "src/app/interfaces/user/name-title";
import { Student } from "src/app/interfaces/user/student";

// services
import { AdvisorService } from "../../services/advisor.service";
import { NameTitleService } from "../../services/name-title.service";
import { StudentService } from "../../services/student.service";

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html'
})
export class AddStudentComponent implements OnInit {

  nameTitleList!: NameTitle[];
  advisorList!: Advisor[];
  studentList!: Student[];

  constructor(
    private nameTitleService: NameTitleService,
    private advisorService: AdvisorService,
    private studentService: StudentService
  ) {
    this.getNameTitleList();
    this.getAdvisorList();
  }

  ngOnInit(): void {
  }
  
  getNameTitleList() {
    this.nameTitleService.getNameTitleList().subscribe({
      next: res => {
        this.nameTitleList = res;
      },
      error: err => {
        console.error(err);
      }
    });
  };
  
  getAdvisorList() {
    this.advisorService.getAdvisorList().subscribe({
      next: res => {
        this.advisorList = res;
      },
      error: err => {
        console.error(err);
      }
    });
  };

  getStudentList() {
    this.studentService.getStudentList().subscribe({
      next: data => {
        this.studentList = data;
      },
      error: err => {
        console.error(err);
      }
    })
  }

  clickToGetStudent() {
    this.getStudentList();
  }
}