import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  public model: any;

  public getModel() {
      return this.model;
  }
  public setModel(model: any): void {
      this.model = model;
  }
  public resetModel() {
      this.model = null;
      return this.model;
  }
}
