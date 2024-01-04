import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjustesComponent } from './components/ajustes/ajustes.component';
import { ClasesComponent } from './components/clases/clases.component';
import { HomeComponent } from './components/home/home.component';
import { EstudiantesComponent } from './components/estudiantes/estudiantes.component';
import { ContabilidadComponent } from './components/gestion/contabilidad/contabilidad.component';
import { GruposComponent } from './components/estudiantes/grupos/grupos.component';
import { HistoricoClasesComponent } from './components/gestion/historico-clases/historico-clases.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'ajustes', component: AjustesComponent },
  { path: 'clases', component: ClasesComponent },
  { path: 'estudiantes', component: EstudiantesComponent },
  { path: 'grupos', component: GruposComponent },
  { path: 'contabilidad', component: ContabilidadComponent },
  { path: 'historico', component: HistoricoClasesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
