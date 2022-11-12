import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMeetingFillComponent } from './project-meeting-fill.component';

describe('ProjectMeetingFillComponent', () => {
  let component: ProjectMeetingFillComponent;
  let fixture: ComponentFixture<ProjectMeetingFillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMeetingFillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectMeetingFillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
