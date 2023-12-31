import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Table } from 'src/app/interfaces/ITable';
import { APIPaths, showErrorMessage } from 'src/app/_common';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends ApiService {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }
  updateEnrollmentDisableStatus(model: any) {
    let onSuccess = (value) => {
      let data = value;
      return data
    };
    return this.service(this.post(APIPaths.updateEnrollmentDisableStatus, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  EnrollmentDetails(model: Table) {
    let onSuccess = (value) => {
      let data = value;
      if (data.totalCount != 0) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.post(APIPaths.EnrollmentDetails, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  EnrolledCoursesCountReport(model: Table) {
    let onSuccess = (value) => {
      let data = value;
      if (data.totalCount != 0) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.post(APIPaths.EnrolledCoursesCountReport, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  GetAllUserGrades(model: Table) {
    let onSuccess = (value) => {
      let data = value;
      if (data.totalCount != 0) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.post(APIPaths.GetAllUserGrades, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  GetGradeById(Id: any) {
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
    return this.service(this.get(APIPaths.getGradeCertificate, params)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
}
