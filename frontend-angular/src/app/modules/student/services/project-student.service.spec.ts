import { TestBed } from '@angular/core/testing';

import { ProjectStudentService } from './project-student.service';

describe('ProjectStudentService', () => {
  let service: ProjectStudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectStudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
