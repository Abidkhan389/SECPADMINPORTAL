import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadedFileinfoService {
  public filename: any;
  public foldername: any;
  constructor() { }
  public setFileDetails(filename: any, foldername: any) {
    this.filename = filename;
    this.foldername = foldername;
  }
  getFilename(): string {
    return this.filename;
  }

  getFoldername(): string {
    return this.foldername;
  }
}
