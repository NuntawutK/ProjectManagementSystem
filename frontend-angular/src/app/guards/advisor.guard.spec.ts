import { TestBed } from '@angular/core/testing';

import { AdvisorGuard } from './advisor.guard';

describe('AdvisorGuard', () => {
  let guard: AdvisorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdvisorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
