import { Component, OnInit } from "@angular/core";
import { Student } from "src/app/interfaces/user/student";
import { StudentService } from "./services/student.service";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html'
})
export class StudentComponent implements OnInit {

  student: Student | undefined;

  constructor(
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.studentService.getStudent().subscribe({
      next: res => {
        if (res?.id) {
          this.student = res;
        } else {
          console.error('cannot get student data');
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }
  
}