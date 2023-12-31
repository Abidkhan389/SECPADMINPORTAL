import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';
import { CourseContentComponent } from './courseContent/courseContent.component'



const routes: Routes = [

  {
    path: 'courseContent',
    component: CourseContentComponent
  },
  {
    path: 'Quiz',
    component: QuizComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
