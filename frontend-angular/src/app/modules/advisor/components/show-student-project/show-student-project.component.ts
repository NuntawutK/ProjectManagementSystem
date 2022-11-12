import { Component, OnInit } from "@angular/core";

// interfaces
import { AcademicYear, AcademicYearSemester } from "src/app/interfaces/project/academic-year-semester";
import { Project } from "src/app/interfaces/project/project";
import { AcademicYearSemesterService } from "../../services/academic-year-semester.service";

// services
import { ConfigService } from "src/app/services/config.service";
import { ProjectService } from "../../services/project.service";

@Component({
  selector: 'app-show-student-project',
  templateUrl: './show-student-project.component.html'
})
export class ShowStudentProjectComponent implements OnInit {

  academicYearList!: AcademicYear[];
  openModal: boolean = false;
  projectId: number = 0;
  selectedProject: Project | undefined;
  
  selectedYearSemester: Partial<AcademicYearSemester> = {
    year: 0,
    semester: 0
  };

  projectList!: Project[];

  constructor(
    private academicYearSemesterService: AcademicYearSemesterService,
    private configService: ConfigService,
    private projectService: ProjectService
  ) { 
  }

  ngOnInit(): void {
    this.getAcademicYearList();
  }

  get appConfig() {
    return this.configService.loadConfig();
  }

  getAcademicYearList() {
    this.academicYearSemesterService.getAcademicYearList().subscribe({
      next: data => {
        this.academicYearList = data;
      },
      error: err => {
        console.error(err);
      }
    })
  }

  handleSelectChange(event: any) {
    if (event.target.id === 'acad-year') this.selectedYearSemester.semester = 0;
    if (!this.selectedYearSemester.year || this.selectedYearSemester.year === 0) {
      return;
    }
    if (!this.selectedYearSemester.semester || this.selectedYearSemester.semester === 0) {
      return;
    }

   this.getStudentProjectList(this.selectedYearSemester?.year, this.selectedYearSemester?.semester);
  }

  getStudentProjectList(academicYear: number, semester: number) {
    this.projectService.getStudentProject(academicYear, semester).subscribe({
      next: data => {
        this.projectList = data;
      },
      error: err => {
        console.error(err);
      }
    })
  }

  toggleOpenModal(value: boolean, projectId: number) {
    this.openModal = value;
    this.projectId = projectId;
    this.getProject(this.projectId);
  }

  getProject(projectId: number) {
    if (projectId === 0) {
      return;
    }
    this.projectService.getProject(projectId).subscribe({
      next: data => {
        if (data.id) {
          this.selectedProject = data;
        }
      },
    })
  }

}