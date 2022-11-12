import { Component, OnInit } from '@angular/core';

// interfaces
import { Student } from 'src/app/interfaces/user/student';

// services
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-show-student-list',
  templateUrl: './show-student-list.component.html'
})
export class ShowStudentListComponent implements OnInit {

  studentList!: Student[];
  filteredStudentList!: Student[];
  checkboxSelector = [
    {
      id: 'student-all',
      labelName: 'ทั้งหมด',
      value: 1,
      checked: true
    },
    {
      id: 'not-start',
      labelName: 'ยังไม่ทำโครงงาน',
      value: 2,
      checked: false
    },
    {
      id: 'on-going',
      labelName: 'กำลังทำโครงงาน',
      value: 3,
      checked: false
    },
    {
      id: 'completed',
      labelName: 'โครงงานเสร็จสิ้น',
      value: 4,
      checked: false
    }
  ];
  selectedCheckboxValue: number = 1;

  constructor(
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.getStudentList();
  }

  getStudentList() {
    this.studentService.getStudentList().subscribe({
      next: data => {
        this.studentList = data;
        this.filteredStudentList = this.studentList;
      },
      error: err => {
        console.error(err);
      }
    });
  }

  handleCheckbox(event: any) {
    this.selectedCheckboxValue = Number(event.target.value);

    this.checkboxSelector.map((item: any) => {
      if (item.value === this.selectedCheckboxValue)
        item.checked = true;
      else
        item.checked = false;
    });

    this.filteredStudentList = this.filteringStudentList(this.selectedCheckboxValue);
    
  }

  filteringStudentList(value: number) {
    let newFilteredStudent!: Student[];
    switch (value) {
      case 1:
        newFilteredStudent = this.studentList;
        break;
      case 2:
        newFilteredStudent = this.studentList.filter(item => (item.onGoing === false && item.completed === false));
        break;
      case 3:
        newFilteredStudent = this.studentList.filter(item => (item.onGoing === true && item.completed === false));
        break;
      case 4:
        newFilteredStudent = this.studentList.filter(item => (item.completed === true));
        break;
      default:
        newFilteredStudent = [];
        break;
    }
    return newFilteredStudent;
  }

  getStatus(index: number) {
    let findStudent = this.studentList.find((_, i) => i === index);
    if (findStudent?.onGoing === false && findStudent?.completed === false)
      return this.checkboxSelector.find(c => c.value === 2)?.labelName;
    else if (findStudent?.onGoing === true && findStudent.completed === false)
      return this.checkboxSelector.find(c => c.value === 3)?.labelName;
    return this.checkboxSelector.find(c => c.value === 4)?.labelName;
  }
}
