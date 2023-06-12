import { TestBed } from '@angular/core/testing';

import { ClubServiveService } from './club-servive.service';

describe('ClubServiveService', () => {
  let service: ClubServiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClubServiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
