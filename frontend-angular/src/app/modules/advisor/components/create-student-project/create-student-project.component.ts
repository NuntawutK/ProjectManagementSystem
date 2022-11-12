import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

// interfaces
import { Student } from "src/app/interfaces/user/student";
import { AcademicYearSemester } from "src/app/interfaces/project/academic-year-semester";
import { Project } from "src/app/interfaces/project/project";

// services
import { ConfigService } from "src/app/services/config.service";
import { ProjectService } from "../../services/project.service";
import { StudentService } from "../../services/student.service";

@Component({
  selector: 'app-create-student-project',
  templateUrl: './create-student-project.component.html'
})
export class CreateStudentProjectComponent implements OnInit {

  loading: boolean = false;

  name = new FormControl('', [Validators.required]);

  studentList!: Student[];
  selectedStudents: string[] = [];

  constructor(
    private studentService: StudentService,
    private projectService: ProjectService,
    private configService: ConfigService
  ) {
  }

  ngOnInit(): void {
    this.getStudentList();
  }

  getStudentList() {
    this.studentService.getStudentForCreateProject().subscribe({
      next: data => {
        this.studentList = data;
      },
      error: err => {
        console.error(err);
      }
    })
  }

  get appConfig() {
    return this.configService.loadConfig();
  }

  submit() {
    if (!this.name.value || this.name.value === '') {
      alert('กรุณากรอกชื่อโครงงาน');
      return;
    }

    this.loading = true;
    let newSelectedStudent: Partial<Student>[] = [];

    this.selectedStudents.map((item: string) => {
      newSelectedStudent.push({
        studentPid: item
      });
    });

    let payload: Partial<Project> = {
      name: this.name.value,
      startAcademicYearSemester: {
        year: this.appConfig?.currentAcademicYearSemester?.year,
        semester: this.appConfig?.currentAcademicYearSemester?.semester
      } as AcademicYearSemester,
      students: newSelectedStudent as Student[],
    }

    this.projectService.createStudentProject(payload).subscribe({
      next: _ => {
        this.loading = false;
        alert('เพิ่มรายการโครงงานสำเร็จ');
        this.getStudentList();
        this.onReset();
        
      },
      error: err => {
        console.log(err);
        this.loading = false;
        alert('พบข้อผิดพลาด กรุณาลองภายหลัง');
      }
    });
  }

  isChecked(studentPid: string) {
    return this.selectedStudents.indexOf(studentPid) !== -1;
  }

  handleClick(studentPid: string) {
    let selectedIndex = this.selectedStudents.indexOf(studentPid);
    let newSelectedClick: string[] = [];

    if (selectedIndex === -1) {
      newSelectedClick = newSelectedClick.concat(this.selectedStudents, studentPid);
    } else if (selectedIndex === 0) {
      newSelectedClick = newSelectedClick.concat(this.selectedStudents.slice(1));
    } else if (selectedIndex === this.selectedStudents.length - 1) {
      newSelectedClick = newSelectedClick.concat(this.selectedStudents.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedClick = newSelectedClick.concat(this.selectedStudents.slice(0, selectedIndex), this.selectedStudents.slice(selectedIndex + 1));
    }

    this.selectedStudents = newSelectedClick;
  }
  
  onReset() {
    this.name = new FormControl('', [Validators.required]);
    this.selectedStudents = [];
  }

}