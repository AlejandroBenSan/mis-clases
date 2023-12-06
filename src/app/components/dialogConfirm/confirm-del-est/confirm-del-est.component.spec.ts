import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDelEstComponent } from './confirm-del-est.component';

describe('ConfirmDelEstComponent', () => {
  let component: ConfirmDelEstComponent;
  let fixture: ComponentFixture<ConfirmDelEstComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDelEstComponent]
    });
    fixture = TestBed.createComponent(ConfirmDelEstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
