import { TestBed } from '@angular/core/testing';

import { ProjectMeetingService } from './project-meeting.service';

describe('ProjectMeetingService', () => {
  let service: ProjectMeetingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectMeetingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
