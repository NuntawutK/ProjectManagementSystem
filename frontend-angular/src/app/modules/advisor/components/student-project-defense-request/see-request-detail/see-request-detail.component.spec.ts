import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeRequestDetailComponent } from './see-request-detail.component';

describe('SeeRequestDetailComponent', () => {
  let component: SeeRequestDetailComponent;
  let fixture: ComponentFixture<SeeRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeeRequestDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
