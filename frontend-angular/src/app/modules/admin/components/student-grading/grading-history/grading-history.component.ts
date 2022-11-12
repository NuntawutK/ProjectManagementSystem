import { Component, OnInit } from '@angular/core';

// interfaces
import { AcademicYear, AcademicYearSemester } from 'src/app/interfaces/project/academic-year-semester';
import { ProjectDefenseResult } from 'src/app/interfaces/project/project-result';

// services
import { ConfigInterface, ConfigService } from 'src/app/services/config.service';
import { AcademicYearSemesterService } from '../../../services/academic-year-semester.service';
import { CsvService } from '../../../services/csv.service';
import { ProjectResultService } from '../../../services/project-result.service';

interface csvExported {
  studentPid: string;
  studentNameTitle: string;
  studentFirstName: string;
  studentLastName: string;
  advisorPid: string;
  projectName: string;
  year: number;
  semester: number;
  grade: string;
}

@Component({
  selector: 'app-grading-history',
  templateUrl: './grading-history.component.html'
})
export class GradingHistoryComponent implements OnInit {
  
  academicYearList!: AcademicYear[];
  academicSemesterList!: number[];
  
  projectDefenseResult: ProjectDefenseResult[] = [];

  constructor(
    private configService: ConfigService,
    private projectResultService: ProjectResultService,
    private academicYearSemesterService: AcademicYearSemesterService,
    private csvService: CsvService
  ) {
  }
  
  get appConfig() {
    return this.configService.loadConfig();
  }

  selectedYearSemester: AcademicYearSemester = {
    year: this.appConfig?.currentAcademicYearSemester.year, semester: this.appConfig?.currentAcademicYearSemester.semester
  } as AcademicYearSemester;

  ngOnInit(): void {
    this.getAcademicYearList();
    this.getProjectDefenseResultByAcademicYearSemester(this.selectedYearSemester?.year, this.selectedYearSemester?.semester);
  }

  getProjectDefenseResultByAcademicYearSemester(year: number, semester: number) {
    this.projectResultService.getProjectDefenseResultByAcademicYearSemester(year, semester).subscribe({
      next: data => {
        this.projectDefenseResult = data;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  getAcademicYearList() {
    this.academicYearSemesterService.getAcademicYearList().subscribe({
      next: data => {
        this.academicYearList = data;
      },
      error: err => {
        console.log(err);
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

    this.getProjectDefenseResultByAcademicYearSemester(this.selectedYearSemester?.year, this.selectedYearSemester?.semester);
  }

  exportGradingHistory() {
    if (this.selectedYearSemester.year === 0 || this.selectedYearSemester.semester === 0) {
      alert('กรุณาเลือกปีการศึกษาและภาคการศึกษาให้ถูกต้อง')
      return;
    }

    if (this.projectDefenseResult.length === 0) {
      alert('ไม่มีข้อมูลของภาคการศึกษานี้')
      return;
    }

    let exportedRawData: csvExported[] = [];
    this.projectDefenseResult.forEach(item => {
      exportedRawData.push({
        studentPid: item.projectStudent.student.studentPid ?? "",
        studentNameTitle: item.projectStudent.student.nameTitle.title ?? "",
        studentFirstName: item.projectStudent.student.firstName ?? "",
        studentLastName: item.projectStudent.student.lastName ?? "",
        advisorPid: item.projectStudent.project.advisor.advisorPid ?? "",
        projectName: item.projectStudent.project.name ?? "",
        year: this.selectedYearSemester.year ?? 0,
        semester: this.selectedYearSemester.semester ?? 0,
        grade: item.grade.gradeValue ?? "",
      });
    });
    let exportedCsvData = this.csvService.saveDataInCSV(exportedRawData);

    var hiddenElement = document.createElement('a');

    // csv UTF-8 encoding (suggested, but cannot read in excel)
    // hiddenElement.href = 'data:text/csv;charset=utf-8' + encodeURI(exportedCsvData);

    // csv UTF-8 BOM encoding (can open in excel properly)
    hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(exportedCsvData);
    hiddenElement.target = '_blank';
    hiddenElement.download = `exported_${this.selectedYearSemester.year}_${this.selectedYearSemester.semester}` + '.csv';
    hiddenElement.click();
  }
}
