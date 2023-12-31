import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Table } from 'src/app/interfaces/ITable';
import { ICourseContent } from 'src/app/interfaces/courseContent/ICourseContent';
import { APIPaths } from 'src/app/_common/constant';
import { showErrorMessage, showInfoMessage, showSuccessMessage } from 'src/app/_common/messages';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class CourseContentService extends ApiService {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }
  addEditContent(model: ICourseContent) {
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
    return this.service(this.post(APIPaths.addEditContent, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  //Get ALl Lectures Against selected Course With Id And Name
  getLecturesForSelectedCourse(Id: any) {
    let params = new HttpParams().set('Id', Id);
    let onSuccess = (value) => {
      let data = value;
      if (data.success) {
        return data.data;
      } else {
        showInfoMessage(data.message)
        return false;
      }
    };
    return this.service(this.get(APIPaths.getLecturesForSelectedCourse, params)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  getContentById(Id: any) {
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
    return this.service(this.get(APIPaths.getContentById, params)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }

  getAllCourseContent(model: Table) {
    let onSuccess = (value) => {
      let data = value;
      if (data.success) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.post(APIPaths.getAllCourseContent, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  updateContent(model: any) {
    let onSuccess = (value) => {
      let data = value;
      return data
    };
    return this.service(this.post(APIPaths.updateContent, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }

}
