import { TestBed } from '@angular/core/testing';

import { ProjectStudentMeetingService } from './project-student.service';

describe('ProjectStudentMeetingService', () => {
  let service: ProjectStudentMeetingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectStudentMeetingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
