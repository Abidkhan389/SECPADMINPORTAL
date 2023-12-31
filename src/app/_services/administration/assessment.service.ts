import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Table } from 'src/app/interfaces/ITable';
import { APIPaths, showErrorMessage, showSuccessMessage } from 'src/app/_common';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService extends ApiService {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }
  getAllAssessment(model:Table) {
    let onSuccess = (value) => {
      let data = value;
      if (data.totalCount != 0) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.post(APIPaths.getAllAssessment,model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  updatestatus(model: any) {
    let onSuccess = (value) => {
      let data = value;
      return data
    };
    return this.service(this.post(APIPaths.updateassessment, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }


 
  addEditAssessment(model:any) {
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
    return this.service(this.post(APIPaths.addEditAssessment,model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  GetAssessmnetById(Id: any) {
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
    return this.service(this.get(APIPaths.GetAssessmnetById, params)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
}
