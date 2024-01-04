import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarClaseComponent } from './cancelar-clase.component';

describe('CancelarClaseComponent', () => {
  let component: CancelarClaseComponent;
  let fixture: ComponentFixture<CancelarClaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelarClaseComponent]
    });
    fixture = TestBed.createComponent(CancelarClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
