import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradingHistoryComponent } from './grading-history.component';

describe('GradingHistoryComponent', () => {
  let component: GradingHistoryComponent;
  let fixture: ComponentFixture<GradingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradingHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
