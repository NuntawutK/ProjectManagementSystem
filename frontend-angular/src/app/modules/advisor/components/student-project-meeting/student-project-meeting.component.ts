import { Component, OnInit } from '@angular/core';

// interfaces
import { Project, ProjectStudent } from 'src/app/interfaces/project/project';
import { ProjectMeeting, ProjectMeetingStatus } from 'src/app/interfaces/project/project-meeting';
import { ConfigInterface, ConfigService } from 'src/app/services/config.service';
import { AcademicNameTitle } from 'src/app/interfaces/user/academic-name-title';
import { Advisor } from 'src/app/interfaces/user/advisor';
import { NameTitle } from 'src/app/interfaces/user/name-title';

// services
import { ProjectService } from '../../services/project.service';
import { ProjectMeetingService } from '../../services/project-meeting.service';
import { AdvisorService } from '../../services/advisor.service';


@Component({
  selector: 'app-student-project-meeting',
  templateUrl: './student-project-meeting.component.html'
})
export class StudentProjectMeetingComponent implements OnInit {
  
  projectStudentList!: ProjectStudent[];
  projectList!: Project[];
  
  constructor(
    private configService: ConfigService,
    private advisorService: AdvisorService,
    private projectService: ProjectService,
    private projectMeetingService: ProjectMeetingService
  ) {
  }

  ngOnInit(): void {
    this.getOnGoingStudentProject();
  }

  get appConfig() {
    return this.configService.loadConfig();
  }

  get advisor() {
    return this.advisorService.loadAdvisor();
  }

  get firstName() { return this.advisor?.firstName; }
  get lastName() { return this.advisor?.lastName; }
  get academicNameTitle() { return this.advisor?.academicNameTitle; }
  get nameTitle() { return this.advisor?.nameTitle; }
  
  getOnGoingStudentProject() {
    this.projectService.getOnGoingStudentProject().subscribe({
      next: data => {
        this.projectList = data;
      },
      error: err => {
        console.error(err);
      }
    })
  }

  submitConfirmation(projectMeetingId: number) {
    let payload: Partial<ProjectMeeting> = {
      projectMeetingStatus: {
        status: 'ตรวจทานเรียบร้อย'
      } as ProjectMeetingStatus,
    }

    this.projectMeetingService.updateProjectMeeting(projectMeetingId, payload).subscribe({
      next: res => {
        if (res.id === projectMeetingId) {
          alert('ยืนยันเรียบร้อย');
          this.getOnGoingStudentProject();
        } else {
          alert('มีปัญหาเกิดขึ้น โปรดลองภายหลัง');
        }
      },
      error: err => {
        alert('ยืนยันล้มเหลว');
        console.error(err);
      }
    })
  }

}
