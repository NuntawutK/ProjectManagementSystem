import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGradingComponent } from './student-grading.component';

describe('StudentGradingComponent', () => {
  let component: StudentGradingComponent;
  let fixture: ComponentFixture<StudentGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentGradingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
