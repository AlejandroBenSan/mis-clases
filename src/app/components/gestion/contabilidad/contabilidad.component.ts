import { Component, OnInit } from '@angular/core';
import { ClaseI } from 'src/app/interfaces/clase';
import { diasClasesI } from 'src/app/interfaces/diasClases';
import { EstudianteI } from 'src/app/interfaces/estudiante';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Observable, forkJoin, map, of, switchMap, take } from 'rxjs';
import { GrupoI } from 'src/app/interfaces/grupo';
import { ServicioContabilidad } from 'src/app/servicios/servicio-contabilidad';

@Component({
  selector: 'app-contabilidad',
  templateUrl: './contabilidad.component.html',
  styleUrls: ['./contabilidad.component.css']
})
export class ContabilidadComponent implements OnInit{

  clases!: Observable<ClaseI[]>;
  diasClases: diasClasesI[] = [];
  ingresosPorMes: any[] = [];

  constructor(private firestore: AngularFirestore, private servicioContabilidad: ServicioContabilidad){
    this.clases = this.obtenerClases();
  }

  ngOnInit(): void {
    this.clases = this.obtenerClases();
    this.cargarDatos();

  }

  cargarDatos() {
    this.clases.subscribe({
      next: (clases) => {
        this.agruparClasesPorDias(clases);
        this.ingresosPorMes = this.servicioContabilidad.calcularIngresosYClasesPorMes(this.diasClases);

        console.log(this.ingresosPorMes)
      },
      error: (error) => console.error('Error:', error)
    });
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
      ref.where('estado', 'in', ['Realizada', 'Cancelada'])
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

  obtenerFechaYHora(timestamp: { seconds: number, nanoseconds: number }): Date {
    // Convierte el Timestamp a un objeto Date
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }

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
}
