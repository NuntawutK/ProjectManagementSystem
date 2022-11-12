import { TestBed } from '@angular/core/testing';

import { NameTitleService } from './name-title.service';

describe('NameTitleService', () => {
  let service: NameTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NameTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
