import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { AdminComponent } from './admin.component';

import { AddAdvisorComponent } from './components/add-advisor/add-advisor.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { SettingsComponent } from './components/settings/settings.component';
import { GradingHistoryComponent } from './components/student-grading/grading-history/grading-history.component';
import { StudentGradingComponent } from './components/student-grading/student-grading.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'add-advisor',
        component: AddAdvisorComponent
      },
      {
        path: 'add-student',
        component: AddStudentComponent
      },
      {
        path: 'student-grading',
        children: [
          {
            path: '',
            component: StudentGradingComponent
          },
          {
            path: 'history',
            component: GradingHistoryComponent
          }
        ]
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        // edit this later
        path: '',
        component: AddAdvisorComponent
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
export class AdminRoutingModule { }
