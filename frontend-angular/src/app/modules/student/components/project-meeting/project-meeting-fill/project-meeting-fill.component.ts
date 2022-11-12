import { Component, Input, OnInit } from '@angular/core';
import { ProjectStudent } from 'src/app/interfaces/project/project';
import { ConfigInterface } from 'src/app/services/config.service';

@Component({
  selector: 'app-project-meeting-fill',
  templateUrl: './project-meeting-fill.component.html'
})
export class ProjectMeetingFillComponent implements OnInit {

  @Input() appConfig!: ConfigInterface;
  @Input() selectedProjectStudent!: ProjectStudent;
  @Input() isProjectMoreTheOne!: boolean;

  constructor() { }

  ngOnInit(): void {
    
  }

  get name() { return this.selectedProjectStudent.project.name; }

  get advisor() { return this.selectedProjectStudent.project.advisor; }

  get startAcademicYearSemester() { return this.selectedProjectStudent.project.startAcademicYearSemester; }

  get students() { return this.selectedProjectStudent.project.students; }

  clickGoBack() {
    window.location.reload();
  }

}
