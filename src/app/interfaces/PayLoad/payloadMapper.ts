import { HttpClient, HttpResponse,HttpRequest,HttpErrorResponse } from '@angular/common/http';
import { MessageTypes } from 'src/app/_common/constant';
import { IPayload } from './payload';



export class PayloadMapper {

    private fromError<T>(o: Error): IPayload<T> {

        return {
            data: null,
            message: {
                messageTypeId: MessageTypes.error,
                text: o.message,
                title: o.name
            }
        };
    }

    private fromHttpError<T>(o: any): IPayload<T> {

        let data: T = null;

        if (o && isPayLoadResponse(o))
            data = this.fromResponse<T>(o).data

        return {
            data: data,
            message: {
                messageTypeId: MessageTypes.error,
                text: o.message,
                title: 'Code:' + o.name
            }
        };
    }

    private fromResponse<T>(o): IPayload<T> {

        let value: IPayload<T> = null;
        if (isPayload<T>(o))
            value = o;
        else
            value = {
                data: <any>o,
                message: {
                    messageTypeId: MessageTypes.success,
                    text: null
                }
            };
        return value;
    }

    public fromObject<T>(o: any): IPayload<T> {
        if (isHttpError(o))
            return this.fromHttpError<T>(o);

        if (o instanceof Error)
            return this.fromError<T>(o);

        if (isPayLoadResponse(o))
            return this.fromResponse<T>(o);

        return null;
    }
}

function isPayLoadResponse(o: HttpResponse<any>): o is HttpResponse<any> {
    let obj= o instanceof Object && 'data' in o && 'message' in o;
  //  let obj= o instanceof Object && 'data' in o && 'config' in o && 'status' in o && 'statusText' in o && 'headers' in o;
    return obj;
}

function isHttpError(o: any): o is HttpErrorResponse {
    return o instanceof Object && o instanceof Error && 'config' in o;
}

function isPayload<T>(o: any): o is IPayload<T> {
    return o instanceof Object && 'data' in o && 'message' in o;
}