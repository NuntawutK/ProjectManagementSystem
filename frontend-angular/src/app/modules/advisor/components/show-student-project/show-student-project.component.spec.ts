import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowStudentProjectComponent } from './show-student-project.component';

describe('CreateStudentProjectComponent', () => {
  let component: ShowStudentProjectComponent;
  let fixture: ComponentFixture<ShowStudentProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowStudentProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowStudentProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
