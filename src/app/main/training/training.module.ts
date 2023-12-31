import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingRoutingModule } from './training-routing.module';
import { QuizComponent } from './quiz/quiz.component';
import { AddeditquizComponent } from './quiz/addeditquiz/addeditquiz.component';
import { CourseContentComponent } from './courseContent/courseContent.component';
import { AddEditCourseContentComponent } from './courseContent/add-edit-courseContent/add-edit-courseContent.component';
import { ShareModule } from 'src/app/-share/-share.module';

@NgModule({
  declarations: [
    CourseContentComponent,
    AddEditCourseContentComponent,
    QuizComponent,
    AddeditquizComponent
  ],
  imports: [
    CommonModule,
    TrainingRoutingModule,
    ShareModule

  ],
  entryComponents: [
    AddEditCourseContentComponent,
    AddeditquizComponent
  ]
})
export class TrainingModule { }
