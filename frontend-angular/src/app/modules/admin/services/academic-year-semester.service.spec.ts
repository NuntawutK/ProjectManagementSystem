import { TestBed } from '@angular/core/testing';

import { AcademicYearSemesterService } from './academic-year-semester.service';

describe('AcademicYearSemesterService', () => {
  let service: AcademicYearSemesterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademicYearSemesterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
