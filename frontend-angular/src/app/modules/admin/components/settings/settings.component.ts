import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

// interfaces
import { AcademicYear } from "src/app/interfaces/project/academic-year-semester";

// services
import { ConfigInterface, ConfigService } from "src/app/services/config.service";
import { AcademicYearSemesterService } from "../../services/academic-year-semester.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  academicYearList!: AcademicYear[];
  semesterList: number[] = [1, 2, 3];

  constructor(
    private configService: ConfigService,
    private academicYearSemesterService: AcademicYearSemesterService
  ) {
  }

  ngOnInit(): void {
    this.getAcademicYearList();
  }

  get appConfig() {
    return this.configService.loadConfig();
  }
  
  configForm = new FormGroup({
    currentAcademicYearSemester: new FormGroup({
      year: new FormControl(this.appConfig?.currentAcademicYearSemester.year ?? 0),
      semester: new FormControl(this.appConfig?.currentAcademicYearSemester.semester ?? 0),
    }),
    maxProjectMeetingItem: new FormControl(this.appConfig?.maxProjectMeetingItem ?? 0),
  });

  saveConfig() {
    this.configService.saveConfig(this.configForm.value as ConfigInterface).subscribe({
      next: (res: any) => {
        if (res.id) {
          alert('บันทึกข้อมูลสำเร็จ');
          setTimeout(() => { window.location.reload(); }, 1000);
        }
      },
      error: _ => {
        alert('บันทึกข้อมูลล้มเหลว');
      }
    })
  }

  getAcademicYearList() {
    this.academicYearSemesterService.getAcademicYearList().subscribe({
      next: data => {
        this.academicYearList = data;
      },
      error: err => {
        console.error(err);
      }
    });
  }
  
}