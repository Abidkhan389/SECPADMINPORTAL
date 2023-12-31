import { IPayloadMessage } from "./payloadMessage";

export interface IPayload<T> {
    data: T;
    message: IPayloadMessage;
}