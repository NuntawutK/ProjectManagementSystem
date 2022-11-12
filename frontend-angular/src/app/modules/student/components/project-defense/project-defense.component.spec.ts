import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDefenseComponent } from './project-defense.component';

describe('ProjectDefenseComponent', () => {
  let component: ProjectDefenseComponent;
  let fixture: ComponentFixture<ProjectDefenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDefenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDefenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
