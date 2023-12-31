import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Table } from 'src/app/interfaces/ITable';
import { APIPaths, showErrorMessage } from 'src/app/_common';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends ApiService {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  } 
  GetDashBoardData() {
    let onSuccess = (value) => {
      let data = value;
      if (data.totalCount != 0) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.get(APIPaths.getDashboarddata)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
}
