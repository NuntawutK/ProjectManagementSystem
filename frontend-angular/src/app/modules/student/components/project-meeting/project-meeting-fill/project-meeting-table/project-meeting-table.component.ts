import { Component, Input, OnInit } from '@angular/core';
import { AcademicYearSemester } from 'src/app/interfaces/project/academic-year-semester';
import { ProjectStudent } from 'src/app/interfaces/project/project';
import { ProjectMeeting, ProjectMeetingStatus } from 'src/app/interfaces/project/project-meeting';
import { ProjectMeetingService } from 'src/app/modules/student/services/project-meeting.service';
import { ConfigInterface } from 'src/app/services/config.service';

@Component({
  selector: 'app-project-meeting-table',
  templateUrl: './project-meeting-table.component.html'
})
export class ProjectMeetingTableComponent implements OnInit {

  @Input() appConfig!: ConfigInterface;
  @Input() studentId!: number;
  @Input() selectedProjectStudent!: ProjectStudent;

  projectMeetings: ProjectMeeting[] = [];
  loading: boolean = false;
  countCompletedMeeting = 0;

  constructor(private projectMeetingService: ProjectMeetingService) {
  }

  ngOnInit(): void {
    this.getProjectMeetingList(this.selectedProjectStudent.id);
  }

  getProjectMeetingList(projectStudentId: number) {
    this.projectMeetingService.getProjectMeetingList(projectStudentId).subscribe({
      next: data => {
        this.projectMeetings = data;
        this.projectMeetings.forEach((item: ProjectMeeting) => {
          if (item.projectMeetingStatus.status === 'ตรวจทานเรียบร้อย') 
            this.countCompletedMeeting++;
        });
      },
      error: err => {
        console.log(err);
      }
    })
  }

  addRow() {
    let newRow: Partial<ProjectMeeting> = {
      assignmentToDo: '',
      assignmentDone: '',
      projectStudentId: this.selectedProjectStudent.id,
      projectMeetingStatus: {
        status: 'กำลังกรอกข้อมูล'
      } as ProjectMeetingStatus,
      assignmentAcademicYearSemester: {
        year: this.appConfig.currentAcademicYearSemester.year,
        semester: this.appConfig.currentAcademicYearSemester.semester
      } as AcademicYearSemester
    }

    this.projectMeetings.push(newRow as ProjectMeeting);
  }

  saveRow(index: number) {
    if(this.projectMeetings[index].assignmentToDo === '' || this.projectMeetings[index].assignmentDone === '') {
      alert('นักศึกษายังไม่เพิ่มข้อมูล กรุณาตรวจสอบอีกครั้ง')
      return;
    }
    this.projectMeetings[index].projectMeetingStatus.status = 'กด (ส่ง) เพื่อบันทึกข้อมูล';
  }

  deleteRow(index: number) {
    this.projectMeetings.splice(index, 1);
  }

  submit() {
    let newProjectMeeting: Partial<ProjectMeeting>[] = this.projectMeetings.filter(p => p.projectMeetingStatus.status === 'กด (ส่ง) เพื่อบันทึกข้อมูล');

    if (newProjectMeeting.length === 0) {
      alert('นักศึกษายังไม่เพิ่มข้อมูล กรุณาตรวจสอบอีกครั้ง')
      return;
    }

    this.loading = true;
    this.projectMeetingService.createProjectMeeting(newProjectMeeting).subscribe({
      next: res => {
        if (res) {
          alert('เพิ่มข้อมูลการพบอาจารย์ที่ปรึกษาสำเร็จ');
          this.getProjectMeetingList(this.selectedProjectStudent.id);
          this.loading = false;
        }
      },
      error: err => {
        console.error(err);
        this.loading = false;
        alert('เพิ่มข้อมูลการพบอาจารย์ที่ปรึกษาล้มเหลว');
      }
    });
  }

}
