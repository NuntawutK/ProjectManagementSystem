import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// import components
import { AdvisorComponent } from "./advisor.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { CreateStudentProjectComponent } from "./components/create-student-project/create-student-project.component";
import { HomeComponent } from './components/home/home.component';
import { SeeRequestDetailComponent } from './components/student-project-defense-request/see-request-detail/see-request-detail.component';
import { ShowStudentListComponent } from './components/show-student-list/show-student-list.component';
import { ShowStudentProjectComponent } from "./components/show-student-project/show-student-project.component";
import { StudentProjectMeetingComponent } from './components/student-project-meeting/student-project-meeting.component';
import { StudentProjectDefenseRequestComponent } from './components/student-project-defense-request/student-project-defense-request.component';

// import modules
import { AdvisorRoutingModule } from "./advisor-routing.module";
import { ShowDetailComponent } from './components/show-student-project/show-detail/show-detail.component';



@NgModule({
  declarations: [
    AdvisorComponent,
    NavbarComponent,
    CreateStudentProjectComponent,
    ShowStudentProjectComponent,
    ShowStudentListComponent,
    HomeComponent,
    StudentProjectMeetingComponent,
    StudentProjectDefenseRequestComponent,
    SeeRequestDetailComponent,
    ShowDetailComponent
  ],
  imports: [
    CommonModule,
    AdvisorRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  exports: [
    AdvisorComponent
  ]
})
export class AdvisorModule { }