import { TestBed } from '@angular/core/testing';

import { ProjectDefenseService } from './project-defense.service';

describe('ProjectDefenseService', () => {
  let service: ProjectDefenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectDefenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
