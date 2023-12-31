import { TestBed } from '@angular/core/testing';

import { UploadedFileinfoService } from './uploaded-fileinfo.service';

describe('UploadedFileinfoService', () => {
  let service: UploadedFileinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadedFileinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
