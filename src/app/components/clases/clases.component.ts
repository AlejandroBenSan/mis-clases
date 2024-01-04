import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { MatSnackBar } from '@angular/material/snack-bar';
import { NuevaClaseNoFechaComponent } from './nueva-clase-no-fecha/nueva-clase-no-fecha.component';
import { ClaseI } from 'src/app/interfaces/clase';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, forkJoin, map, of, switchMap, take } from 'rxjs';
import { EstudianteI } from 'src/app/interfaces/estudiante';
import { diasClasesI } from 'src/app/interfaces/diasClases';
import { GrupoI } from 'src/app/interfaces/grupo';
import { ModificarClaseComponent } from './modificar-clase/modificar-clase.component';
import { ConfirmarClaseComponent } from './confirmar-clase/confirmar-clase.component';
import { CancelarClaseComponent } from './cancelar-clase/cancelar-clase.component';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent {

  dataSource: MatTableDataSource<ClaseI>
  clases!: Observable<ClaseI[]>;
  displayedColumns: string[] = ['hora','duracion', 'estudiantes', 'precio', 'estado', 'acciones'];
  diasClases: diasClasesI[] = [];
  
  //filtros
  filtroNombre: string | null = null;
  diasClasesFiltrados: diasClasesI[] = [];
  filtroActivo: boolean = false;

  constructor(private firestore: AngularFirestore, public dialog: MatDialog, private snackBar: MatSnackBar){
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.clases = this.obtenerClases();
    this.cargarDatos();
  }

  cargarDatos() {
    this.clases.subscribe({
      next: (clases) => {
        this.agruparClasesPorDias(clases);

        this.dataSource.data = clases;
      },
      error: (error) => console.error('Error:', error)
    });
  }

  aplicarFiltroNombre(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value.toLowerCase();

    this.diasClasesFiltrados = this.diasClases.map(dia => ({
        ...dia,
        clases: dia.clases.filter(clase => 
            (clase.nombreGrupo && clase.nombreGrupo.toLowerCase().includes(valorFiltro)) ||
            clase.estudiantes.some(estudiante => {
                const nombreCompleto = `${estudiante.nombre} ${estudiante.apellidos}`.toLowerCase();
                return nombreCompleto.includes(valorFiltro);
            })
        )
    })).filter(dia => dia.clases.length > 0);
    this.filtroActivo = true;
}

  agruparClasesPorDias(clases: ClaseI[]) {
    const mapaDias = new Map<string, ClaseI[]>();
  
    clases.forEach(clase => {
      const dia = clase.fechaHora.toISOString().split('T')[0];
      if (!mapaDias.has(dia)) {
        mapaDias.set(dia, []);
      }
      mapaDias.get(dia)?.push(clase);
    });
  
    // Ordenar las clases por hora dentro de cada día
    mapaDias.forEach((clasesPorDia) => {
      clasesPorDia.sort((a, b) => a.fechaHora.getTime() - b.fechaHora.getTime());
    });
  
    // Convertir el mapa a un array y ordenarlo por fecha
    this.diasClases = Array.from(mapaDias, ([fecha, clases]) => ({
      fecha: new Date(fecha),
      clases
    })).sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  }


  obtenerClases(): Observable<ClaseI[]>{
    return this.firestore.collection('clases', ref => 
      ref.where('estado', 'in', ['Activo', 'Revisar'])
      ).snapshotChanges()
      .pipe(switchMap(clasesSnapshot => {
        const gruposObservables = clasesSnapshot.map(claseDoc => {
          // Aquí, extraemos el ID del documento y lo añadimos al objeto grupo
          const clase = claseDoc.payload.doc.data() as ClaseI;
          const fecha = claseDoc.payload.doc.data() as any
          clase.id = claseDoc.payload.doc.id; // Añadir el ID del grupo aquí
          //Convertimos la fecha y hora 
          clase.fechaHora = this.obtenerFechaYHora(fecha.fechaHora);
          //Comprobamos si la clase es para un grupo
          if(clase.idGrupo == ""){
            //Es una clase particular
            return this.obtenerEstudianteParticular(clase.idParticular!).pipe(
              map(estudiante => {
                  // Si estudiante es null o un objeto vacío, asignar un arreglo vacío a clase.estudiantes
                  clase.estudiantes = estudiante ? [estudiante] : [];
                  return clase;
              })
          );
          }else{
            //Es una clase de grupo
            //obtenemos el nombre del grupo
            this.obtenerNombreGrupo(clase.idGrupo!).subscribe(nombreGrupo => {
              clase.nombreGrupo = nombreGrupo;
            });

            return this.obtenerEstudiantesDelGrupo(clase.estudiantesIds!).pipe(
              map(estudiantes => {
                clase.estudiantes = estudiantes;
                return clase;
              })
            );
          }
        });

        return forkJoin(gruposObservables);
      })
    );
  }

  limpiarFiltros() {
    this.filtroNombre = null;

    //Limpiamos el filtro para mostrar todas las clases
    this.filtroActivo = false;
}

  //OBTENEMOS LOS ESTUDIANTES DEL GRUPO
  private obtenerEstudiantesDelGrupo(estudiantesIds: string[]): Observable<EstudianteI[]> {
    
    if (estudiantesIds.length === 0) {
      // Si no hay estudiantes, retorna un observable vacío
      return of([]);
    }
  
    const estudiantesObservables = estudiantesIds
    .filter(id => id)  // Filtra IDs no válidos o vacíos
    .map(id => 
      this.firestore.collection('estudiantes').doc(id).snapshotChanges().pipe(
        map(action => action.payload.data() as EstudianteI),
        take(1)
      )
    );
  
    return forkJoin(estudiantesObservables);
  }

  private obtenerNombreGrupo(idGrupo: string): Observable<string> {
    if (!idGrupo) {
      return of(""); // Retorna un observable de una cadena vacía si el id es inválido
    }
  
    return this.firestore.collection('grupos').doc(idGrupo).snapshotChanges().pipe(
      map(action => {
        const grupo = action.payload.data() as GrupoI; // Castear a GrupoI
        return grupo ? grupo.nombre : ""; // Retorna el nombre del grupo o una cadena vacía si no se encuentra
      }),
      take(1)
    );
  }

  //OBTENEMOS EL ESTUDIANTE DE LA CLASE PARTICULAR
  private obtenerEstudianteParticular(estudianteId: string): Observable<EstudianteI> {
    if (!estudianteId) {
      // Si el ID del estudiante es inválido o vacío, retorna un Observable de un EstudianteI vacío
      return of({} as EstudianteI);
    }
  
    return this.firestore.collection('estudiantes').doc(estudianteId).snapshotChanges().pipe(
      map(action => action.payload.data() as EstudianteI),
      take(1)
    );
  }

  //CAMBIAMOS EL FORMATO DE LA FECHA 
  obtenerFechaYHora(timestamp: { seconds: number, nanoseconds: number }): Date {
    // Convierte el Timestamp a un objeto Date
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }

  addClassUndefinedDate(){
    {
      const dialogRef = this.dialog.open(NuevaClaseNoFechaComponent, {
        width: '500px',
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
  
          console.log(result);
        }
      });
    }
  }

  editClass(clase:any): void {
    // Lógica para editar una clase
    const dialogRef = this.dialog.open(ModificarClaseComponent, {
      width: '500px',
      disableClose: true,
      data: {clase: clase, diasClases: this.diasClases}
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        console.log(result);
      }
    });

  }

  deleteClass(clase:any): void {
    // Lógica para eliminar una clase
    const dialogRef = this.dialog.open(CancelarClaseComponent, {
      width: '500px',
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.firestore.collection('clases').doc(clase.id).update({
          estado: "Cancelada"
        })
        .then(() => {
          this.snackBar.open('Clase cancelada con éxito', 'Cerrar', {
            duration: 2000,
          });
        })
        .catch(error => {
          this.snackBar.open('Se ha producido un error al cancelar la clase', 'Cerrar', {
            duration: 2000,
          });
          console.log(error)
      });
      }
    });
  }

  doneClass(clase: ClaseI): void {
    // Lógica para eliminar una clase
    const dialogRef = this.dialog.open(ConfirmarClaseComponent, {
      width: '500px',
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.firestore.collection('clases').doc(clase.id).update({
          estado: "Realizada"
        })
        .then(() => {
          this.snackBar.open('Clase realizada con éxito', 'Cerrar', {
            duration: 2000,
          });
        })
        .catch(error => {
          this.snackBar.open('Se ha producido un error al actualizar la clase', 'Cerrar', {
            duration: 2000,
          });
          console.log(error)
      });
      }
    });
  }

}
