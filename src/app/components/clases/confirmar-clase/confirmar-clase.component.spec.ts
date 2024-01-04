import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarClaseComponent } from './confirmar-clase.component';

describe('ConfirmarClaseComponent', () => {
  let component: ConfirmarClaseComponent;
  let fixture: ComponentFixture<ConfirmarClaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmarClaseComponent]
    });
    fixture = TestBed.createComponent(ConfirmarClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
