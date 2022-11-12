import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectDefenseComponent } from './create-project-defense.component';

describe('CreateProjectDefenseComponent', () => {
  let component: CreateProjectDefenseComponent;
  let fixture: ComponentFixture<CreateProjectDefenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProjectDefenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProjectDefenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
