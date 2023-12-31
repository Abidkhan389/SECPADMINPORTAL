import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { APIPaths, ResultMessages, showErrorMessage } from '../_common';
import { ApiService } from './api.service';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService  extends ApiService{

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }
  deleteFile(file, referenceType, folderName?) {
    let param = new HttpParams().set('filename', file).set('referenceType', referenceType).set('folderName', folderName ? folderName : '');
    let onSuccess = (data) => {
      if (data.success)
        return true;
      else
        showErrorMessage(data.message);
    };
    return this.service(this.get(APIPaths.deleteAttachemnt, param)).pipe(
      map(value => this.processPayload(value)),
      map(onSuccess)
    );
  }
  downloadFileFromFolder(file: string, folderName?) {
    let param = new HttpParams().set('filename', file).set('folderName', folderName ? folderName : '');
    return this.httpClient.get(APIPaths.downloadAttachemnt, { responseType: 'blob', params: param })
      .subscribe(blob => {
      if (blob.size > 0){
        saveAs(blob, file);
      }
      else
        showErrorMessage(ResultMessages.fileNotFound);
    });
  }
}
