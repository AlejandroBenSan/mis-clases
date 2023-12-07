import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaClaseNoFechaComponent } from './nueva-clase-no-fecha.component';

describe('NuevaClaseNoFechaComponent', () => {
  let component: NuevaClaseNoFechaComponent;
  let fixture: ComponentFixture<NuevaClaseNoFechaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevaClaseNoFechaComponent]
    });
    fixture = TestBed.createComponent(NuevaClaseNoFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
