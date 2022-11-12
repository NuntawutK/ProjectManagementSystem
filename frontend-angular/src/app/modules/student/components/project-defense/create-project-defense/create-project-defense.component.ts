import { Component, OnInit } from '@angular/core';

// interfaces
import { AcademicYearSemester } from 'src/app/interfaces/project/academic-year-semester';
import { ProjectStudent } from 'src/app/interfaces/project/project';
import { ProjectDefenseRequest } from 'src/app/interfaces/project/project-defense';
import { ProjectMeeting } from 'src/app/interfaces/project/project-meeting';

// services
import { ConfigInterface, ConfigService } from 'src/app/services/config.service';
import { ProjectStudentService } from '../../../services/project-student.service';
import { ProjectDefenseService } from '../../../services/project-defense.service';

@Component({
  selector: 'app-create-project-defense',
  templateUrl: './create-project-defense.component.html'
})
export class CreateProjectDefenseComponent implements OnInit {

  projectStudentList: ProjectStudent[] = [];
  selectedProjectStudent!: ProjectStudent | undefined;
  // appConfig: Partial<ConfigInterface> = {
  //   currentAcademicYearSemester: {
  //     year: 0,
  //     semester: 0
  //   }
  // }
  partOfSubject: boolean = false;
  partOfSubjectName: string = '';

  constructor(
    private projectStudentService: ProjectStudentService,
    private projectDefenseService: ProjectDefenseService,
    private configService: ConfigService
  ) {
    // this.getConfig();
  }

  ngOnInit(): void {
    this.getProjectStudentList();
  }

  // getConfig() {
  //   this.configService.getConfig().subscribe({
  //     next: (res: any) => {
  //       if (res.id) {
  //         this.appConfig = res;
  //       }
  //     },
  //     error: err => {
  //       console.error(err);
  //     }
  //   });
  // }

  get appConfig() {
    return this.configService.loadConfig();
  }

  getProjectStudentList() {
    this.projectStudentService.getProjectStudentList().subscribe({
      next: data => {
        this.projectStudentList = data;
        if (this.projectStudentList.length === 1) this.selectedProjectStudent = this.projectStudentList[0];
      },
      error: err => {
        console.error(err);
      }
    })
  }

  handleSelectChange(event: any) {
    this.partOfSubject = false;
    this.partOfSubjectName = '';

    if (!event.target.value) {
      this.selectedProjectStudent = undefined;
      return;
    };

    let index = Number(event.target.value);
    this.selectedProjectStudent = this.projectStudentList[index];
  }

  toggleRadioChange(bool: boolean) {
    this.partOfSubject = bool;
  }

  submit() {
    if (!this.selectedProjectStudent?.projectMeetings) {
      alert('พบปัญหาที่ไม่ทราบสาเหตุ กรุณาลองในภายหลัง');
      return; 
    }
    if (!this.appConfig?.maxProjectMeetingItem) {
      alert('พบปัญหาที่ไม่ทราบสาเหตุ กรุณาลองในภายหลัง');
      return; 
    }

    let confirmationText = 'นักศึกษาได้ตรวจทานเรียบร้อยแล้ว\nยืนยันการขอขึ้นสอบโครงงาน ?';
    if (confirm(confirmationText) === false) {
      return;
    }

    let countMeetingPassed = 0;
    this.selectedProjectStudent?.projectMeetings.forEach((item: ProjectMeeting) => {
      if (item.projectMeetingStatus.status === 'ตรวจทานเรียบร้อย') countMeetingPassed++;
    });
    if (countMeetingPassed < this.appConfig?.maxProjectMeetingItem) {
      alert(`นักศึกษายังไม่เข้าพบอาจารย์ที่ปรึกษาครบ ${this.appConfig?.maxProjectMeetingItem} ครั้ง กรุณาตรวจสอบรายละเอียดอีกครั้ง`);
      return; 
    }

    if (this.partOfSubject === true && this.partOfSubjectName === '') {
      alert('กรุณากรอกชื่อรายวิชา')
      return;
    }

    let payload: Partial<ProjectDefenseRequest> = {
      projectStudentId: this.selectedProjectStudent?.id,
      partOfSubject: this.partOfSubject,
      partOfSubjectName: this.partOfSubjectName,
      requestAcademicYearSemester: {
        year: this.appConfig.currentAcademicYearSemester?.year,
        semester: this.appConfig.currentAcademicYearSemester?.semester 
      } as AcademicYearSemester
    }

    this.projectDefenseService.createProjectDefenseRequest(payload).subscribe({
      next: res => {
        if (res.id) {
          alert('Project defense request created');
          window.location.href = "/student/project-defense";
        }
      },
      error: err => {
        if (typeof err === 'string') {
          if (err.includes('YOUR_REQUEST_IS_DUPLICATE')) {
            alert('Your request is duplicate');
            return;
          } else if (err.includes('YOUR_REQUEST_IS_APPROVED')) {
            alert('Your request is approved, cannot create new request');
            return;
          }
        }
        alert('Failed to create project defense request');
      }
    })
  }

  get studentPid() { return this.selectedProjectStudent?.student.studentPid; }

  get studentNameTitle() { return this.selectedProjectStudent?.student.nameTitle; }
  get studentfirstName() { return this.selectedProjectStudent?.student.firstName; }
  get studentlastName() { return this.selectedProjectStudent?.student.lastName; }
  get studentFullName() {
    return `${this.studentNameTitle?.title}${this.studentfirstName} ${this.studentlastName}`;
  }

  get projectName() { return this.selectedProjectStudent?.project.name; }
  get projectMeetings() { return this.selectedProjectStudent?.projectMeetings; }

  get advisorPid() { return this.selectedProjectStudent?.project.advisor; }
  get advisorAcademicNameTitle() { return this.selectedProjectStudent?.project.advisor.academicNameTitle; }
  get advisorNameTitle() { return this.selectedProjectStudent?.project.advisor.nameTitle; }
  get advisorFirstName() { return this.selectedProjectStudent?.project.advisor.firstName; }
  get advisorLastName() { return this.selectedProjectStudent?.project.advisor.lastName; }
  get advisorFullName() { 
    return `${this.advisorAcademicNameTitle?.title} ${this.advisorNameTitle?.title}${this.advisorFirstName} ${this.advisorLastName}`; 
  }

  get projectStartYear() { return this.selectedProjectStudent?.project.startAcademicYearSemester?.year; }
  get projectStartSemester() { return this.selectedProjectStudent?.project.startAcademicYearSemester?.semester; }

}
