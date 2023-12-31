import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { APIPaths } from '../_common/constant';
import { showErrorMessage, showInfoMessage } from '../_common/messages';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LookupService extends ApiService {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
}
//Get ALl Courses With Id And Name
getAllCoursesForDDL()
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
  return this.service(this.get(APIPaths.getAllCoursesDDL)).pipe(
    map(value => this.processPayload(value)),
    map(onSuccess)
  );
}
//Get All Categories with name and id for dropdown
getAllCategoriesForCourses()
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
  return this.service(this.get(APIPaths.getAllCategoriesForCourses)).pipe(
    map(value => this.processPayload(value)),
    map(onSuccess)
  );
}

GetAllLecturesByCourseId(val) {
  let params = new HttpParams().set('Id', val);
  let onSuccess = (value) => {
    let data = value;
    if (data.success) {
      return data.data;
    } else {
      showInfoMessage("No Lecture Exist Against The Selected Course")
      return false;
    }
  };
  return this.service(this.get(APIPaths.getLecturesForSelectedCourse,params)).pipe(
    map(value => this.processPayload(value)),
    map(onSuccess)
  );
}
}
