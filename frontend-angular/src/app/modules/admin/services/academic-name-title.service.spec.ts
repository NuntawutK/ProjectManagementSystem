import { TestBed } from '@angular/core/testing';

import { AcademicNameTitleService } from './academic-name-title.service';

describe('AcademicNameTitleService', () => {
  let service: AcademicNameTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademicNameTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});