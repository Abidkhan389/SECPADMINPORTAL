import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Table } from 'src/app/interfaces/ITable';
import { IQuiz } from 'src/app/interfaces/Quiz/IQuiz';
import { APIPaths } from 'src/app/_common/constant';
import { showErrorMessage, showInfoMessage, showSuccessMessage } from 'src/app/_common/messages';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService extends ApiService {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  } 
  getAllQuizez(model:Table) {
    let onSuccess = (value) => {
      let data = value;
      if (data.totalCount != 0) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.post(APIPaths.GetAllByProc,model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  updatestatus(model: any) {
    let onSuccess = (value) => {
      let data = value;
      return data
    };
    return this.service(this.post(APIPaths.updatestatus, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }


 
  addEditQuiz(model:any) {
    let onSuccess = (value) => {
      let data = value;
      if (data.success) {
        showSuccessMessage(data.message)
        return true;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.post(APIPaths.addEditQuiz,model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  GetQuizById(Id: any) {
    let params = new HttpParams().set('Id', Id);
    let onSuccess = (value) => {
      let data = value;
      if (data.success) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.get(APIPaths.GetQuestionById, params)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  GetLecturesAgainstCourse(Id:any)
  {
    let params = new HttpParams().set('Id', Id);
    let onSuccess = (value) => {
      let data = value;
      if (data.success) {
        console.log(data)
        return data.data;
      } else {
        showInfoMessage(data.message)
        return false;
      }
    };
    return this.service(this.get(APIPaths.GetLecturesAgainstCourse,params)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  
  getAllCourses()
  {
    let onSuccess = (value) => {
      let data = value;
      if (data.success) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.get(APIPaths.getAllCoursesforquiz)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
}
