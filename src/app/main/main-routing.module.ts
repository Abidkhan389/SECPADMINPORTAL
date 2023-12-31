import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { CoursesComponent } from './courses/courses.component';
import { LectureComponent } from './lecture/lecture.component';
import { MainComponent } from './main.component';
import { UserMangementComponent } from './user-mangement/user-mangement.component';
import { EnrolledCourseReportComponent } from './enrolled-course-report/enrolled-course-report.component';
import { CoursescountReportComponent } from './coursescount-report/coursescount-report.component';
import { EnrollUserComponent } from './enroll-user/enroll-user.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { GradesReportComponent } from './grades-report/grades-report.component';
import { EnrollmentApprovalComponent } from './enrollment-approval/enrollment-approval.component';
import { GradingCriteriaComponent } from './grading-criteria/grading-criteria.component';
import { ApprovalRequestsComponent } from './approval-requests/approval-requests.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  //{path:'', redirectTo:'categories',pathMatch:'full'},
  // {
  //   path: '',
  
  //   // children:[
  //   //   {
  //   //     path: 'training',
  //   //     loadChildren: () => import('./training/training.module').then(m => m.TrainingModule),
  //   //   },
  //   // ]

  {
    path:'Dashboard',
    component:DashboardComponent
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'courses',
    component: CoursesComponent
  },
  {
    path: 'lecture',
    component: LectureComponent
  },
  {
    path: 'training',
    loadChildren: () => import('./training/training.module').then(m => m.TrainingModule),
  },
  {
    path: 'user',
    component: UserMangementComponent
  },
  {
    path: 'userReport',
    component: EnrolledCourseReportComponent
  },
  {
    path: 'CoursesCountReport',
    component: CoursescountReportComponent
  },
  {
    path: 'EnrollUser',
    component: EnrollUserComponent
  },
  {
    path: 'Assessment',
    component: AssessmentComponent
  },
  {
    path: 'GradesReport',
    component: GradesReportComponent
  },
  {
    path: 'ApprovalUserCourse',
    component: EnrollmentApprovalComponent
  },
  {
    path: 'GradingCriteria',
    component: GradingCriteriaComponent
  },
  {
    path: 'CourseApprovalrequests',
    component: ApprovalRequestsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
