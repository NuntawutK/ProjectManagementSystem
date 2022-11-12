import { Component, OnInit } from '@angular/core';

import { ProjectStudent } from 'src/app/interfaces/project/project';
import { ConfigInterface, ConfigService } from 'src/app/services/config.service';
import { ProjectStudentService } from '../../services/project-student.service';

@Component({
  selector: 'app-project-meeting',
  templateUrl: './project-meeting.component.html'
})
export class ProjectMeetingComponent implements OnInit {

  projectStudentList: ProjectStudent[] = [];
  selectedProjectStudent!: ProjectStudent;
  appConfig: ConfigInterface = {
    currentAcademicYearSemester: {
      year: 0,
      semester: 0
    },
    maxProjectMeetingItem: 0
  };
  projectMoreThanOne = false;

  constructor(
    private projectStudentService: ProjectStudentService,
    private configService: ConfigService
  ) { }

  status: string = '';

  ngOnInit(): void {
    this.getConfig();
    this.getProjectStudentList();
  }

  getConfig() {
    this.configService.getConfig().subscribe({
      next: (res: any) => {
        if (res.id) {
          this.appConfig = res;
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }

  getProjectStudentList() {
    this.projectStudentService.getProjectStudentList().subscribe({
      next: data => {
        this.projectStudentList = data;

        if (this.projectStudentList.length === 1) {
          this.selectedProjectStudent = this.projectStudentList[0];
        } else if (this.projectStudentList.length === 0) {
          this.status = 'ไม่พบโครงงาน โปรดติดต่ออาจารย์ที่ปรึกษา';
        } else {
          this.projectMoreThanOne = true;
        }

      },
      error: err => {
        console.error(err);
        this.status = err;
      }
    });
  }

  setSelectedProjectStudent(eventIndex: number) {
    this.selectedProjectStudent = this.projectStudentList[eventIndex]
  }

}
