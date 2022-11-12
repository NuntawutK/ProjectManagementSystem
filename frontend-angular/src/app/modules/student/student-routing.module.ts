import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NotFoundComponent } from "src/app/components/not-found/not-found.component";
import { HomeComponent } from "./components/home/home.component";
import { CreateProjectDefenseComponent } from "./components/project-defense/create-project-defense/create-project-defense.component";
import { ProjectDefenseComponent } from "./components/project-defense/project-defense.component";
import { ProjectMeetingComponent } from "./components/project-meeting/project-meeting.component";
import { StudentComponent } from "./student.component";

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'project-meeting',
        component: ProjectMeetingComponent,
      },
      {
        path: 'project-defense',
        children: [
          {
            path: '',
            component: ProjectDefenseComponent,
          },
          {
            path: 'create',
            component: CreateProjectDefenseComponent,
          },
        ],
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
export class StudentRoutingModule { }