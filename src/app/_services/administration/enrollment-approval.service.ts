import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { APIPaths, showErrorMessage } from 'src/app/_common';
import { map } from 'rxjs/operators';
import { Table } from 'src/app/interfaces/ITable';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentApprovalService extends ApiService {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }
  fetchAllWaitingForApprovalUserList(model: Table) {
    let onSuccess = (value) => {
      let data = value;
      if (data.totalCount != 0) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.post(APIPaths.fetchAllWaitingForApprovalUserList, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  //fetch those users course approval request who send again request for course approval
  AgainRequestsForCourseApproval(model: Table) {
    let onSuccess = (value) => {
      let data = value;
      if (data.totalCount != 0) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.post(APIPaths.AgainRequestsForCourseApproval, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  ApproveUserRequest(Id: any) {
    let params = new HttpParams().set('Id', Id);
    let onSuccess = (value) => {
      let data = value;
      return data
    };
    return this.service(this.get(APIPaths.ApproveUserRequest, params)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
}
