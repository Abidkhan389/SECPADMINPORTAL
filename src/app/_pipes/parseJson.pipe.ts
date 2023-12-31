import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'parseJson' })
export class ParseJsonPipe implements PipeTransform {
    transform(value, obj) {
        if (value) {
            if (obj)
                return JSON.parse(value)[obj.outputProp];
            else
                return JSON.parse(value);
        }
        return null;
    }
}