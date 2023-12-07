import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl  } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Observable } from 'rxjs';
import { EstudianteI } from 'src/app/interfaces/estudiante';
import { map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-crear-grupo',
  templateUrl: './crear-grupo.component.html',
  styleUrls: ['./crear-grupo.component.css']
})
export class CrearGrupoComponent {

  grupoForm: FormGroup
  estudiantes: Observable<EstudianteI[]> = this.firestore.collection<EstudianteI>('estudiantes').valueChanges({ idField: 'id' });
  estudiantesFiltrados$: Observable<EstudianteI[]>;
  estudiantesControl = new FormControl();
  
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CrearGrupoComponent>, 
    private snackBar: MatSnackBar, private firestore: AngularFirestore){

      this.grupoForm = this.fb.group({
        nombre: ['', Validators.required],
        estudiantes: this.estudiantesControl,
        precio: [null, Validators.required],
        activo: [true, Validators.required]
      });

       // Filtro de estudiantes
       this.estudiantesFiltrados$ = this.estudiantesControl.valueChanges.pipe(
        startWith(''),
        switchMap(valor => this.obtenerEstudiantesFiltrados(valor))
      );
  }

  ngOnInit(): void {
    this.obtenerEstudiantes()
  }

  displayFn(estudiante: EstudianteI): string {
    return estudiante && estudiante.nombre ? estudiante.nombre : '';
  }

  private obtenerEstudiantesFiltrados(valor: string): Observable<EstudianteI[]> {
    if (typeof valor !== 'string') {
      valor = '';
    }

    const filtroValor = valor.toLowerCase();
    return this.estudiantes.pipe(
      map(estudiantes => estudiantes.filter(estudiante => 
        estudiante.nombre.toLowerCase().includes(filtroValor) || 
        estudiante.apellidos?.toLowerCase().includes(filtroValor))
      )
    );
  }
  obtenerEstudiantes() {
    this.estudiantes = this.firestore.collection<EstudianteI>('estudiantes', ref => 
      ref.where('activo', '==', "true")
    ).valueChanges({ idField: 'id' });
  }

  guardarGrupo(){

  }
}
