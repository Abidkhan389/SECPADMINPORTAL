import { TestBed } from '@angular/core/testing';

import { GradingCriteriaService } from './grading-criteria.service';

describe('GradingCriteriaService', () => {
  let service: GradingCriteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradingCriteriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
