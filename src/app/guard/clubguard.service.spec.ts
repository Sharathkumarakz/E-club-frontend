import { TestBed } from '@angular/core/testing';

import { ClubguardService } from './clubguard.service';

describe('UserguardService', () => {
  let service: ClubguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClubguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
