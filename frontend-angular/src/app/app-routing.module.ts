import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { AdminLoginPageComponent } from './components/admin-login-page/admin-login-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { UserLoginPageComponent } from './components/user-login-page/user-login-page.component';

// guards
import { AdminGuard } from './guards/admin.guard';
import { AdvisorGuard } from './guards/advisor.guard';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { StudentGuard } from './guards/student.guard';

const routes: Routes = [
  {
    path: '',
    // check if not token then redirect to login route
    canActivate: [AuthGuard],
    children: []
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'advisor',
    canActivate: [AdvisorGuard],
    loadChildren: () => import('./modules/advisor/advisor.module').then(m => m.AdvisorModule)
  },
  {
    path: 'student',
    canActivate: [StudentGuard],
    loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule)
  },
  {
    path: 'login',
    canActivateChild: [LoginGuard],
    children: [
      {
        path: '',
        component: UserLoginPageComponent
      },
      {
        path: 'admin',
        component: AdminLoginPageComponent
      }
    ]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
