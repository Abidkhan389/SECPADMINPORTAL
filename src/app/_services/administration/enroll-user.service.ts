import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Table } from 'src/app/interfaces/ITable';
import { APIPaths, showErrorMessage, showInfoMessage, showSuccessMessage } from 'src/app/_common';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EnrollUserService extends ApiService {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }
  getAllEnrollUsers(model: Table) {
    let onSuccess = (value) => {
      let data = value;
      if (data.totalCount != 0) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.post(APIPaths.getAllEnrollUsers, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  addEditEnrollUser(model: any) {
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
    return this.service(this.post(APIPaths.addEditEnrollUser, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  GetCourseDDLByCategory(Id: any) {
    let params = new HttpParams().set('Id', Id);
    let onSuccess = (value) => {
      let data = value;
      if (data.success) {
        return data.data;
      } else {
        showInfoMessage("No Course Exist Against The Selected Category")
        return false;
      }
    };
    return this.service(this.get(APIPaths.getCourseByCategoryId, params)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  GetEnrollUserById(Id: any) {
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
    return this.service(this.get(APIPaths.GetEnrollUserById, params)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  GetAllUsers() {
    let onSuccess = (value) => {
      let data = value;
      if (data.success) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.get(APIPaths.GetAllUsers)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
}


