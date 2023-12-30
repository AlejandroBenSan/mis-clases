import { NgModule, LOCALE_ID  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EstudiantesComponent } from './components/estudiantes/estudiantes.component';
import { ClasesComponent } from './components/clases/clases.component';
import { ContabilidadComponent } from './components/contabilidad/contabilidad.component';
import { AjustesComponent } from './components/ajustes/ajustes.component';
import { HomeComponent } from './components/home/home.component';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { firebaseConfig } from './environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NuevoEstudianteModalComponent } from './components/estudiantes/nuevo-estudiante-modal/nuevo-estudiante-modal.component';
import {MatRadioModule} from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDelEstComponent } from './components/dialogConfirm/confirm-del-est/confirm-del-est.component';
import { ModificarEstudianteComponent } from './components/estudiantes/modificar-estudiante/modificar-estudiante.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import {MatBadgeModule} from '@angular/material/badge';
import { NuevaClaseNoFechaComponent } from './components/clases/nueva-clase-no-fecha/nueva-clase-no-fecha.component';
import { CrearGrupoComponent } from './components/estudiantes/crear-grupo/crear-grupo.component';
import { MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { GruposComponent } from './components/estudiantes/grupos/grupos.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ModificarGrupoComponent } from './components/estudiantes/modificar-grupo/modificar-grupo.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';

//PARA REGISTRAR EL IDIOMA ESPAÑOL
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    EstudiantesComponent,
    ClasesComponent,
    ContabilidadComponent,
    AjustesComponent,
    HomeComponent,
    NuevoEstudianteModalComponent,
    ConfirmDelEstComponent,
    ModificarEstudianteComponent,
    NuevaClaseNoFechaComponent,
    CrearGrupoComponent,
    GruposComponent,
    ModificarGrupoComponent,
  ],
  imports: [
    BrowserModule,
    MatCheckboxModule,
    MatGridListModule,
    NgbTimepickerModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatSelectModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatRadioModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAnalyticsModule,
    NgbModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
