import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// modules
import { StudentRoutingModule } from "./student-routing.module";

// components
import { StudentComponent } from "./student.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ProjectMeetingComponent } from './components/project-meeting/project-meeting.component';
import { SelectProjectComponent } from './components/project-meeting/select-project/select-project.component';
import { ProjectMeetingFillComponent } from './components/project-meeting/project-meeting-fill/project-meeting-fill.component';
import { ProjectMeetingTableComponent } from './components/project-meeting/project-meeting-fill/project-meeting-table/project-meeting-table.component';
import { HomeComponent } from './components/home/home.component';
import { ProjectDefenseComponent } from './components/project-defense/project-defense.component';
import { CreateProjectDefenseComponent } from './components/project-defense/create-project-defense/create-project-defense.component';
import { SeeRequestDetailComponent } from './components/project-defense/see-request-detail/see-request-detail.component';
import { SubmitRequestFileComponent } from './components/project-defense/submit-request-file/submit-request-file.component';

@NgModule({
  declarations: [
    StudentComponent,
    NavbarComponent,
    ProjectMeetingComponent,
    SelectProjectComponent,
    ProjectMeetingFillComponent,
    ProjectMeetingTableComponent,
    HomeComponent,
    ProjectDefenseComponent,
    CreateProjectDefenseComponent,
    SeeRequestDetailComponent,
    SubmitRequestFileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    StudentRoutingModule
  ],
  providers: [],
  exports: [
    StudentComponent
  ]
})
export class StudentModule { }