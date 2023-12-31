import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPayload } from '../interfaces/PayLoad/payload';
import { PayloadMapper } from '../interfaces/PayLoad/payloadMapper';
import { MessageTypes } from '../_common/constant';
import { Helpers } from '../_common/_helper/app_helper';
import { map } from 'rxjs/operators';

export interface IBaseService {
  service: <T>(cb: Observable<{}>) => Observable<any>;
  get: <T>(endPoint: string, params?: any) => Observable<any>;
  post: <T>(endPoint: string, model?: any) => Observable<any>;
}
interface IProcessPayloadOptions<T> {
  messageTypeIds?: string[];
}
@Injectable({
  providedIn: 'root'
})
export abstract class ApiService implements IBaseService {

  constructor(protected httpClient: HttpClient) { }


  processPayload<T>(payload: IPayload<T>, messageTypeIds?: string[]) {
    const message = payload.message;
    messageTypeIds = messageTypeIds || [MessageTypes.error, MessageTypes.failure];
    const messageTypeId = messageTypeIds.find(o => o === message.messageTypeId);
    if (messageTypeId) {
      return (payload.message);
    } else {
      return (payload.data);
    }
  }

  service<T>(cb: Observable<{}>): Observable<IPayload<T>> {
    const onFulfilled = (value) => new PayloadMapper().fromObject<T>(value);
    const onRejection = (reason) => new PayloadMapper().fromObject<T>(reason);

    return cb.pipe(map(onFulfilled, onRejection));
  }

  /**
* POST request
* @param {string} endPoint end point of the api
* @param {Object} params body of the request.
* @param {IRequestOptions} options options of the request like headers, body, etc.
* @returns {Observable<T>}
*/
  post<T>(endPoint, model?): Observable<T> {
    if (model)
      model = Helpers.trimObject(model);
    return this.httpClient.post<T>(endPoint, model)
  }

  /**
* GET request
* @param {string} endPoint it doesn't need / in front of the end point
* @param {IRequestOptions} options options of the request like headers, body, etc.
* @returns {Observable<T>}
*/
  get<T>(endPoint, params?): Observable<T> {
    if (params)
      return this.httpClient.get<T>(endPoint, { params: params })
    else
      return this.httpClient.get<T>(endPoint)
  }

}