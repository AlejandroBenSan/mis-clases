import { NgModule } from '@angular/core';
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
  ],
  imports: [
    BrowserModule,
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
