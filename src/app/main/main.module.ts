import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { CategoriesComponent } from './categories/categories.component';

import { AddEditCategorieComponent } from './categories/add-edit-categorie/add-edit-categorie.component';
import { CoursesComponent } from './courses/courses.component';
import { AddeditcoursesComponent } from './courses/addeditcourses/addeditcourses.component';
import { TrainingModule } from './training/training.module';
import { LectureComponent } from './lecture/lecture.component';
import { AddEditLectureComponent } from './lecture/add-edit-lecture/add-edit-lecture.component';
import { ShareModule } from '../-share/-share.module';
import { UserMangementComponent } from './user-mangement/user-mangement.component';
import { AddeditUserComponent } from './user-mangement/addedit-user/addedit-user.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EnrolledCourseReportComponent } from './enrolled-course-report/enrolled-course-report.component';
import { CoursescountReportComponent } from './coursescount-report/coursescount-report.component';
import { EnrollUserComponent } from './enroll-user/enroll-user.component';
import { AddeditEnrollUserComponent } from './enroll-user/addedit-enroll-user/addedit-enroll-user.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { AddeditassessmentComponent } from './assessment/addeditassessment/addeditassessment.component';
import { GradesReportComponent } from './grades-report/grades-report.component';
import { EnrollmentApprovalComponent } from './enrollment-approval/enrollment-approval.component';
import { GradingCriteriaComponent } from './grading-criteria/grading-criteria.component';
import { AddEditGradingCriteriaComponent } from './grading-criteria/add-edit-grading-criteria/add-edit-grading-criteria.component';
import { ApprovalRequestsComponent } from './approval-requests/approval-requests.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    MainComponent,
    CategoriesComponent,
    AddEditCategorieComponent,
    CoursesComponent,
    AddeditcoursesComponent,
    LectureComponent,
    AddEditLectureComponent,
    UserMangementComponent,
    AddeditUserComponent,
    EnrolledCourseReportComponent,
    CoursescountReportComponent,
    EnrollUserComponent,
    AddeditEnrollUserComponent,
    AssessmentComponent,
    AddeditassessmentComponent,
    GradesReportComponent,
    EnrollmentApprovalComponent,
    GradingCriteriaComponent,
    AddEditGradingCriteriaComponent,
    ApprovalRequestsComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    TrainingModule,
    ShareModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ChartsModule,
  ],
  entryComponents: [
    AddEditCategorieComponent,
    AddeditcoursesComponent,
    AddEditLectureComponent
  ],
})
export class MainModule { }
