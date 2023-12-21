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
        estudiantesSeleccionados: [[], Validators.required], // Cambio aquí
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
    const filtroValor = valor.toLowerCase();
    return this.estudiantes.pipe(
      map(estudiantes => estudiantes.filter(estudiante => 
        estudiante.nombre.toLowerCase().includes(filtroValor) || 
        estudiante.apellidos!.toLowerCase().includes(filtroValor))
      )
    );
  }

  obtenerEstudiantes() {
    this.estudiantes = this.firestore.collection<EstudianteI>('estudiantes', ref => 
      ref.where('activo', '==', "true")
    ).valueChanges({ idField: 'id' });
  }

  guardarGrupo() {
    const grupoData = this.grupoForm.value;
  
    // Verificar si el formulario es válido
    if (this.grupoForm.invalid) {
      this.snackBar.open('Formulario no válido', 'Cerrar', {
        duration: 2000,
      });
      return;
    }

    if(grupoData.estudiantesSeleccionados.length == 1){
      this.snackBar.open('No se puede crear un grupo con solo un estudiante', 'Cerrar', {
        duration: 2000,
      });
    }

    // Comprobar si ya existe un grupo con el mismo nombre
    this.firestore.collection('grupos', ref => ref.where('nombre', '==', grupoData.nombre))
      .get()
      .subscribe(docSnapshot => {
        if (docSnapshot.empty) {
          // El grupo no existe, proceder a guardarlo
          this.firestore.collection('grupos').add({
            nombre: grupoData.nombre,
            estudiantesIds: grupoData.estudiantesSeleccionados, // Aquí asumo que estás guardando los IDs de los estudiantes
            precioClase: grupoData.precio,
            activo: grupoData.activo
          }).then(() => {
            this.snackBar.open('Grupo guardado con éxito', 'Cerrar', {
              duration: 2000,
            });
            this.dialogRef.close();
          }).catch(error => {
            console.error('Error al guardar el grupo: ', error);
            this.snackBar.open('Error al guardar el grupo', 'Cerrar', {
              duration: 2000,
            });
          });
        } else {
          // El grupo ya existe
          this.snackBar.open('Ya existe un grupo con ese nombre', 'Cerrar', {
            duration: 2000,
          });
        }
      });
  }
}
