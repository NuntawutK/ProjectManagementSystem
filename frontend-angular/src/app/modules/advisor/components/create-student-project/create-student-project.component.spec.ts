import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStudentProjectComponent } from './create-student-project.component';

describe('CreateStudentProjectComponent', () => {
  let component: CreateStudentProjectComponent;
  let fixture: ComponentFixture<CreateStudentProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStudentProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStudentProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
