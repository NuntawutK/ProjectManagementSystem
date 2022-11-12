import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMeetingComponent } from './project-meeting.component';

describe('ProjectMeetingComponent', () => {
  let component: ProjectMeetingComponent;
  let fixture: ComponentFixture<ProjectMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMeetingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
