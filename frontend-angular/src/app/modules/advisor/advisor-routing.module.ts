import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "src/app/components/not-found/not-found.component";

// components
import { AdvisorComponent } from "./advisor.component";
import { CreateStudentProjectComponent } from "./components/create-student-project/create-student-project.component";
import { HomeComponent } from "./components/home/home.component";
import { ShowStudentListComponent } from "./components/show-student-list/show-student-list.component";
import { ShowStudentProjectComponent } from "./components/show-student-project/show-student-project.component";
import { StudentProjectDefenseRequestComponent } from "./components/student-project-defense-request/student-project-defense-request.component";
import { StudentProjectMeetingComponent } from "./components/student-project-meeting/student-project-meeting.component";

const routes: Routes = [
  {
    path: '',
    component: AdvisorComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'create-student-project',
        component: CreateStudentProjectComponent
      },
      {
        path: 'student-project-meeting',
        component: StudentProjectMeetingComponent
      },
      {
        path: 'student-project-defense-request',
        component: StudentProjectDefenseRequestComponent
      },
      {
        path: 'show-student-project',
        component: ShowStudentProjectComponent
      },
      {
        path: 'show-student-list',
        component: ShowStudentListComponent
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvisorRoutingModule { }