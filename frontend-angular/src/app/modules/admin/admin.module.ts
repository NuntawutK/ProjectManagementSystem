import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// components
import { AdminComponent } from './admin.component';
import { GradingHistoryComponent } from './components/student-grading/grading-history/grading-history.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StudentGradingComponent } from './components/student-grading/student-grading.component';

// modules
import { AdminRoutingModule } from './admin-routing.module';
import { AddAdvisorModule } from './components/add-advisor/add-advisor.module';
import { AddStudentModule } from './components/add-student/add-student.module';

// services
import { AcademicNameTitleService } from './services/academic-name-title.service';
import { NameTitleService } from './services/name-title.service';
import { CsvService } from './services/csv.service';
import { AdvisorService } from './services/advisor.service';
import { StudentService } from './services/student.service';

@NgModule({
  declarations: [
    AdminComponent,
    NavbarComponent,
    SettingsComponent,
    StudentGradingComponent,
    GradingHistoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule,
    AddAdvisorModule,
    AddStudentModule
  ],
  providers: [
    AcademicNameTitleService,
    NameTitleService,
    CsvService,
    AdvisorService,
    StudentService,
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }
