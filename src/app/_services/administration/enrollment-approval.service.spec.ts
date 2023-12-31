import { TestBed } from '@angular/core/testing';

import { EnrollmentApprovalService } from './enrollment-approval.service';

describe('EnrollmentApprovalService', () => {
  let service: EnrollmentApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollmentApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
