import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Observable, forkJoin,map,switchMap,of, tap, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GrupoI } from 'src/app/interfaces/grupo';
import { MatTableDataSource } from '@angular/material/table';
import { CrearGrupoComponent } from '../crear-grupo/crear-grupo.component';
import { EstudianteI } from 'src/app/interfaces/estudiante';
import { ModificarGrupoComponent } from '../modificar-grupo/modificar-grupo.component';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent {

  dataSource: MatTableDataSource<GrupoI>
  displayedColumns: string[] = ['nombre', 'estudiantes', 'precio clase','acciones'];
  grupos!: Observable<GrupoI[]>

  constructor(private firestore: AngularFirestore, public dialog: MatDialog, private snackBar: MatSnackBar){
    this.dataSource = new MatTableDataSource();
    
  }

  ngOnInit(): void {
    this.grupos = this.obtenerGruposConEstudiantes()
    this.cargarDatos();
  }

  cargarDatos() {
    this.grupos.subscribe({
      next: (grupos) => {
        console.log('Grupos cargados:', grupos);
        this.dataSource.data = grupos;
      },
      error: (error) => console.error('Error:', error)
    });
    
  }
  
  obtenerGruposConEstudiantes(): Observable<GrupoI[]> {
    return this.firestore.collection('grupos').snapshotChanges().pipe(
      switchMap(gruposSnapshot => {
        const gruposObservables = gruposSnapshot.map(grupoDoc => {
          // Aquí, extraemos el ID del documento y lo añadimos al objeto grupo
          const grupo = grupoDoc.payload.doc.data() as GrupoI;
          grupo.id = grupoDoc.payload.doc.id; // Añadir el ID del grupo aquí

          return this.obtenerEstudiantesDelGrupo(grupo.estudiantesIds).pipe(
            map(estudiantes => {
              grupo.estudiantes = estudiantes;
              return grupo;
            })
          );
        });

        return forkJoin(gruposObservables);
      })
    );
}

  private obtenerEstudiantesDelGrupo(estudiantesIds: string[]): Observable<EstudianteI[]> {
    if (estudiantesIds.length === 0) {
      // Si no hay estudiantes, retorna un observable vacío
      return of([]);
    }
  
    const estudiantesObservables = estudiantesIds.map(id => 
      this.firestore.collection('estudiantes').doc(id).snapshotChanges().pipe(
        map(action => action.payload.data() as EstudianteI),
        //IMPORTANTE PARA QUE FUNCIONE
        take(1)  // Asegura que cada Observable emita al menos un valor y se complete
      )
    );
  
    return forkJoin(estudiantesObservables);
  }


  nuevoGrupo(){
    const dialogRef = this.dialog.open(CrearGrupoComponent, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
        }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  listarNombresEstudiantes(estudiantes: EstudianteI[]): string {
    return estudiantes?.map(est => `${est.nombre} ${est.apellidos}`).join(', ') || 'Sin estudiantes';
  }

  editarGrupo(grupo: GrupoI){
    const dialogRef = this.dialog.open(ModificarGrupoComponent, {
      width: '500px',
      disableClose: true,
      data: { grupo: grupo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.firestore.collection('grupos').doc(result.id).update({
          activo: result.activo,
          nombre: result.nombre,
          precioClase: result.precioClase,
          estudiantesIds: result.estudiantesIds
        })
          .then(() => {
            this.snackBar.open('Grupo actualizado con éxito', 'Cerrar', {
              duration: 2000, // Duración del mensaje en milisegundos
            });
          })
          .catch(error => {
            console.log(error)
            this.snackBar.open('Error al actualizar grupo', 'Cerrar', {
              duration: 2000, // Duración del mensaje en milisegundos
            });
          });
      }
  });
  }

  eliminarGrupo(grupo: GrupoI){

  }
}
