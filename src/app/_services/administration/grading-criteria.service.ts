import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { APIPaths, showErrorMessage, showSuccessMessage } from 'src/app/_common';
import { map } from 'rxjs/operators';
import { Table } from 'src/app/interfaces/ITable';
import { ICourse } from 'src/app/interfaces/Courses/ICourse';

@Injectable({
  providedIn: 'root'
})
export class GradingCriteriaService extends ApiService{

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  } 
  getAllGradingCriteria(model:Table) {
    let onSuccess = (value) => {
      let data = value;
      if (data.totalCount != 0) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.post(APIPaths.getAllGradingCriteria,model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  addEditGradingCriteria(model:any) {
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
    return this.service(this.post(APIPaths.addEditGradingCriteria, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  GetGradingCriteriaById(Id: any) {
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
    return this.service(this.get(APIPaths.GetGradingCriteriaById, params)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
}
