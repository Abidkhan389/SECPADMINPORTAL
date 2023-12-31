import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ICategory } from 'src/app/interfaces/category/ICategory';
import { Table } from 'src/app/interfaces/ITable';
import { APIPaths } from 'src/app/_common/constant';
import { showErrorMessage, showInfoMessage, showSuccessMessage } from 'src/app/_common/messages';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends ApiService {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }
  getAllCategories(model: Table) {
    let onSuccess = (value) => {
      let data = value;
      if (data.totalCount != 0) {
        return data.data;
      } else {
        showErrorMessage(data.message)
        return false;
      }
    };
    return this.service(this.post(APIPaths.getAllCategories, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  updateCategory(model: any) {
    let onSuccess = (value) => {
      let data = value;
      return data
    };
    return this.service(this.post(APIPaths.updateCategory, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }


  addEditCateory(model: ICategory) {
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
    return this.service(this.post(APIPaths.addEditCategory, model)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  GetCategoryById(Id: any) {
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
    return this.service(this.get(APIPaths.getCategoryById, params)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
}

