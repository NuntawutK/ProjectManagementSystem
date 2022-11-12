import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitRequestFileComponent } from './submit-request-file.component';

describe('SubmitRequestFileComponent', () => {
  let component: SubmitRequestFileComponent;
  let fixture: ComponentFixture<SubmitRequestFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitRequestFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitRequestFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
