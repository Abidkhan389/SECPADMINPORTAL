import { TestBed } from '@angular/core/testing';

import { UserManegementService } from './user-manegement.service';

describe('UserManegementService', () => {
  let service: UserManegementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManegementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
