import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProjectDefenseRequestComponent } from './student-project-defense-request.component';

describe('StudentProjectDefenseRequestComponent', () => {
  let component: StudentProjectDefenseRequestComponent;
  let fixture: ComponentFixture<StudentProjectDefenseRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentProjectDefenseRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentProjectDefenseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
