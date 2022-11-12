import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProjectMeetingComponent } from './student-project-meeting.component';

describe('StudentProjectMeetingComponent', () => {
  let component: StudentProjectMeetingComponent;
  let fixture: ComponentFixture<StudentProjectMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentProjectMeetingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentProjectMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
