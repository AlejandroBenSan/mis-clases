import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { EstudianteI } from 'src/app/interfaces/estudiante';
import { MatDialog } from '@angular/material/dialog';
import { NuevoEstudianteModalComponent } from './nuevo-estudiante-modal/nuevo-estudiante-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDelEstComponent } from '../dialogConfirm/confirm-del-est/confirm-del-est.component';
import { ModificarEstudianteComponent } from './modificar-estudiante/modificar-estudiante.component';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent {

  estudiantes: Observable<EstudianteI[]> = this.firestore.collection<EstudianteI>('estudiantes').valueChanges({ idField: 'id' });
  dataSource: MatTableDataSource<EstudianteI>
  displayedColumns: string[] = ['nombre', 'apellidos', 'email', 'acciones'];
  
  constructor(private firestore: AngularFirestore, public dialog: MatDialog, private snackBar: MatSnackBar){
    this.dataSource = new MatTableDataSource();

  }
  
  ngOnInit(): void {
    this.obtenerEstudiantes()
  }

  nuevoEstudiante() {
    const dialogRef = this.dialog.open(NuevoEstudianteModalComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.guardarEstudiante(result);
      }
    });
  }

  guardarEstudiante(datosEstudiante: EstudianteI) {
    this.firestore.collection('estudiantes').add(datosEstudiante)
      .then(() => {
        console.log('Estudiante agregado con éxito');
        this.mostrarSnackBar('Estudiante agregado con éxito', 'success-snackbar');
      })
      .catch(error => {
        this.mostrarSnackBar('Error al agregar estudiante', 'error-snackbar');
      });
  }

  mostrarSnackBar(mensaje: string, className: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [className]
    });
  }

  obtenerEstudiantes() {
    this.estudiantes = this.firestore.collection<EstudianteI>('estudiantes', ref => 
      ref.where('activo', '==', "true")
    ).valueChanges({ idField: 'id' });

    this.estudiantes.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editarEstudiante(estudiante: EstudianteI) {
    const dialogRef = this.dialog.open(ModificarEstudianteComponent, {
        width: '500px',
        disableClose: true,
        data: { estudiante: estudiante } // Pasando datos al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.actualizarEstudiante(result);
        }
    });
}

actualizarEstudiante(datosEstudiante: EstudianteI) {
  console.log(datosEstudiante.id)
  this.firestore.collection('estudiantes').doc(datosEstudiante.id).update({
    activo: datosEstudiante.activo,
    nombre: datosEstudiante.nombre,
    apellidos: datosEstudiante.apellidos,
    edad: datosEstudiante.edad,
    telefono: datosEstudiante.telefono,
    email: datosEstudiante.email

  })
    .then(() => {
      console.log('Estudiante actualizado con éxito');
      this.mostrarSnackBar('Estudiante actualizado con éxito', 'success-snackbar');
    })
    .catch(error => {
      console.log('Error al actualizar estudiante: ', error);
      this.mostrarSnackBar('Error al actualizar estudiante', 'error-snackbar');
    });
}

  eliminarEstudiante(estudiante: EstudianteI) {
    const dialogRef = this.dialog.open(ConfirmDelEstComponent, {
      width: '250px',
      data: { mensaje: '¿Estás seguro de que deseas eliminar a este estudiante? Pasara a estar no activo.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.firestore.collection('estudiantes').doc(estudiante.id).update({ activo: false })
          .then(() => {
            // Manejar respuesta exitosa, por ejemplo, mostrar un Snackbar
          })
          .catch(error => {
            // Manejo de errores, por ejemplo, mostrando un mensaje de error
          });
      }
    });
  }


}

