import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMeetingTableComponent } from './project-meeting-table.component';

describe('ProjectMeetingTableComponent', () => {
  let component: ProjectMeetingTableComponent;
  let fixture: ComponentFixture<ProjectMeetingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMeetingTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectMeetingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
