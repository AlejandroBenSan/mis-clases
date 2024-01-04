import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoClasesComponent } from './historico-clases.component';

describe('HistoricoClasesComponent', () => {
  let component: HistoricoClasesComponent;
  let fixture: ComponentFixture<HistoricoClasesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricoClasesComponent]
    });
    fixture = TestBed.createComponent(HistoricoClasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
