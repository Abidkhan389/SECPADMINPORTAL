import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Table } from 'src/app/interfaces/ITable';
import { ILecture } from 'src/app/interfaces/lecture/ILecture';
import { APIPaths } from 'src/app/_common/constant';
import { showErrorMessage, showSuccessMessage } from 'src/app/_common/messages';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class LectureService extends ApiService {

  constructor(public httpClient : HttpClient) { 
    super(httpClient)
  }

  getAllLectures(model: Table) {
    let onSuccess = (value) => {
      let data = value;
      if (data.success) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.post(APIPaths.getAllLectures, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  updateLectures(model: any) {
    let onSuccess = (value) => {
      let data = value;
      return data
    };
    return this.service(this.post(APIPaths.updateLecture, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  getLectureById(Id: any) {
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
    return this.service(this.get(APIPaths.getLectureById, params)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  addEditLecture(model: ILecture) {
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
    return this.service(this.post(APIPaths.addEditLectures, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
}
