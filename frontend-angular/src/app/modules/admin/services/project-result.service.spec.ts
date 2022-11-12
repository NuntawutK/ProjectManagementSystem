import { TestBed } from '@angular/core/testing';

import { ProjectResultService } from './project-result.service';

describe('ProjectResultService', () => {
  let service: ProjectResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
