import { Component, OnInit } from '@angular/core';

// services
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
  }

  get student() {
    return this.studentService.loadStudent();
  }

  get firstName() { return this.student?.firstName; }
  get lastName() { return this.student?.lastName; }
  get nameTitle() { return this.student?.nameTitle; }
  get studentPid() { return this.student?.studentPid; }

}
