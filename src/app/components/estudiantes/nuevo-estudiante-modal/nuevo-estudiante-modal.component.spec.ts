import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoEstudianteModalComponent } from './nuevo-estudiante-modal.component';

describe('NuevoEstudianteModalComponent', () => {
  let component: NuevoEstudianteModalComponent;
  let fixture: ComponentFixture<NuevoEstudianteModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevoEstudianteModalComponent]
    });
    fixture = TestBed.createComponent(NuevoEstudianteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
