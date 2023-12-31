import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Table } from 'src/app/interfaces/ITable';
import { IUserDetail } from 'src/app/interfaces/user/IUserDetail';
import { APIPaths, showErrorMessage, showInfoMessage, showSuccessMessage } from 'src/app/_common';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class UserManegementService extends ApiService {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }
  getAllUsers(model: Table) {
    let onSuccess = (value) => {
      let data = value;
      if (data.totalCount != 0) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.post(APIPaths.getAllUser, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  updateUser(model: any)
  {
    let onSuccess = (value) => {
      let data = value;
      return data
    };
    return this.service(this.post(APIPaths.updateUser, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  getUserDetail(Id : any)
  {
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
    return this.service(this.get(APIPaths.getUserById, params)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  getUserDetailForCertificate(Id : any)
  {
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
    return this.service(this.get(APIPaths.getUserDetailForCertificate, params)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  addEditUser(model: IUserDetail) {
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
    return this.service(this.post(APIPaths.addEditUser, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );

  }
}
