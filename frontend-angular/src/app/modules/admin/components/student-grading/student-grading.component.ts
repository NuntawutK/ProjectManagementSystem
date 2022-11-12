import { Component, OnInit } from '@angular/core';

// interfaces
import { AcademicYearSemester } from 'src/app/interfaces/project/academic-year-semester';
import { Project, ProjectStatus } from 'src/app/interfaces/project/project';
import { Student } from 'src/app/interfaces/user/student';

// services
import { ConfigInterface, ConfigService } from 'src/app/services/config.service';
import { ProjectStudentService } from '../../services/project-student.service';
import { ProjectResultService } from '../../services/project-result.service';

@Component({
  selector: 'app-student-grading',
  templateUrl: './student-grading.component.html'
})
export class StudentGradingComponent implements OnInit {
  
  students: Student[] = [];
  
  projectList!: Project[];
  projectStatusList: ProjectStatus[] = [];

  constructor(
    private configService: ConfigService,
    private projectStudentService: ProjectStudentService,
    private projectResultService: ProjectResultService
  ) {
  }

  ngOnInit(): void {
    this.getProjectStatusList();
    this.getProjectForGrading();
  }

  get appConfig() {
    return this.configService.loadConfig();
  }

  getProjectStatusList() {
    this.projectStudentService.getProjectStatusList().subscribe({
      next: data => {
        this.projectStatusList = data;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  getProjectForGrading() {
    this.projectStudentService.getProjectForGradingList().subscribe({
      next: data => {
        this.projectList = [];
        data.map((item: any) => {
          if (item.gradingAcademicYearSemester) {
            if (!(item.gradingAcademicYearSemester.year === this.appConfig?.currentAcademicYearSemester.year && item.gradingAcademicYearSemester.semester === this.appConfig?.currentAcademicYearSemester.semester)) {
              this.projectList.push(item);
            }
          } else {
            this.projectList.push(item);
          }
        });
      },
      error: err => {
        console.error(err);
      }
    })
  }
  
  submit() {
    if (confirm('ตรวจสอบข้อมูลเรียบร้อยแล้ว หากโครงงานใดที่ไม่มีผลการประเมินจะติดเกรด P โดยอัตโนมัติ') === false) {
      return;
    }

    let payload: Partial<Project>[] = [];
    this.projectList.forEach(item => {
      payload.push({
        id: item.id,
        projectStatusId: item.projectStatusId,
        gradingAcademicYearSemester: {
          year: this.appConfig?.currentAcademicYearSemester.year,
          semester: this.appConfig?.currentAcademicYearSemester.semester,
        } as AcademicYearSemester,
      })
    })
    console.log(payload);
    
    this.projectResultService.createProjectResult(payload).subscribe({
      next: _ => {
        
        alert('completed!');
        this.getProjectForGrading();
      },
      error: _ => {
        alert('failed!');
      }
    });
  }

}
