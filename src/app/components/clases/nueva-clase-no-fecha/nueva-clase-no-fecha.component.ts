import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstudianteI } from 'src/app/interfaces/estudiante';
import { Observable, forkJoin, map, of, switchMap, take } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { GrupoI } from 'src/app/interfaces/grupo';
import { MatSelectChange } from '@angular/material/select';
import { diasClasesI } from 'src/app/interfaces/diasClases';
import { ClaseI } from 'src/app/interfaces/clase';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

@Component({
  selector: 'app-nueva-clase-no-fecha',
  templateUrl: './nueva-clase-no-fecha.component.html',
  styleUrls: ['./nueva-clase-no-fecha.component.css'],
  //Hay que poner esto para que se muestren los colores de los dias en el calendario
  encapsulation: ViewEncapsulation.None,
})
export class NuevaClaseNoFechaComponent {

  claseForm: FormGroup;
  estudiantes: Observable<EstudianteI[]> = this.firestore.collection<EstudianteI>('estudiantes').valueChanges({ idField: 'id' });
  grupos: Observable<GrupoI[]> = this.firestore.collection<GrupoI>('grupos').valueChanges({ idField: 'id' });
  //AUTORELLENO DEL PRECIO
  estudiantesNoSeleccionados: EstudianteI[] = []
  gruposNoSeleccionados: GrupoI[] = []
  //
  diasClases: diasClasesI[] = [];
  clases!: Observable<ClaseI[]>;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<NuevaClaseNoFechaComponent>, 
    private snackBar: MatSnackBar, private firestore: AngularFirestore){

      this.claseForm = this.fb.group({
        tipoClase: [''],
        estudiante: [''],
        grupo: [''],
        id: [''], // Opcional, por lo general no se incluye en el formulario
        estudiantes: this.fb.array([], Validators.required), // Se maneja como un array de form controls
        fecha: [null, Validators.required],
        hora: [null, Validators.required],
        precio: [null, [Validators.required, Validators.min(0)]],
        contenido: [''],
        deberes: [''],
        estado: ['', Validators.required],
        urlDocumento: [''] // Opcional, depende de si quieres manejar documentos
      });
  }

  ngOnInit(): void {
    this.clases = this.obtenerClases()
    this.cargaDatos()

  }

  time = { hour: 13, minute: 30 };

  //FUNCION PARA COMPROBAR LOS DIAS QUE HAY CLASES Y MARCARLAS EN EL CALENDARIO
  isClaseDay: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Asegúrate de aplicar la lógica solo en la vista del mes
    if (view === 'month') {
      const date = cellDate.getDate();
      const month = cellDate.getMonth(); // 0 para Enero, 1 para Febrero, etc.
      const year = cellDate.getFullYear();
  
      for (let i = 0; i < this.diasClases.length; i++) {
        // Asegurarse de que 'fecha' es un objeto Date
        if (this.diasClases[i].fecha instanceof Date) {
          const claseDate = this.diasClases[i].fecha.getDate();
          const claseMonth = this.diasClases[i].fecha.getMonth();
          const claseYear = this.diasClases[i].fecha.getFullYear();
  
          // Comprueba si el año, mes y día coinciden
          if (date === claseDate && month === claseMonth && year === claseYear) {
            return 'custom-date-class';
          }
        }
      }
    }
  
    return '';
  };

  onEstudianteSelected(event: MatSelectChange) {
    const estudianteSeleccionado = this.estudiantesNoSeleccionados.find(e => e.id === event.value);
    // Actualiza el precioClaseEstudiante basado en estudianteSeleccionado
    this.claseForm.get('precio')!.setValue(estudianteSeleccionado ? estudianteSeleccionado.precioClase : '');
  }
  
  onGrupoSelected(event: MatSelectChange) {
    const grupoSeleccionado = this.gruposNoSeleccionados.find(g => g.id === event.value);
    // Actualiza el precioClaseGrupo basado en grupoSeleccionado
    this.claseForm.get('precio')!.setValue(grupoSeleccionado ? grupoSeleccionado.precioClase : '');
  }

  async agruparClasesPorDias(clases: ClaseI[]) {
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

  cargaDatos(){
    this.estudiantes.subscribe(estudiantes => {
      this.estudiantesNoSeleccionados = estudiantes;
    });
  
    this.grupos.subscribe(grupos => {
      this.gruposNoSeleccionados = grupos;
      console.log(grupos)
    });

    this.clases.subscribe({
      next: async (clases) => {
        console.log('Clases cargadas modal:', clases);
        await this.agruparClasesPorDias(clases);

      },
      error: (error) => console.error('Error:', error)
    });
  }

  obtenerClases(): Observable<ClaseI[]>{
    return this.firestore.collection('clases').snapshotChanges().pipe(
      switchMap((clasesSnapshot: any[]) => {
        const gruposObservables = clasesSnapshot.map(claseDoc => {
          // Aquí, extraemos el ID del documento y lo añadimos al objeto grupo
          const clase = claseDoc.payload.doc.data() as ClaseI;
          const fecha = claseDoc.payload.doc.data() as any
          clase.id = claseDoc.payload.doc.id; // Añadir el ID del grupo aquí
          //Convertimos la fecha y hora 
          clase.fechaHora = this.obtenerFechaYHora(fecha.fechaHora);
          //Comprobamos si la clase es para un grupo

          // Retorna un Observable de ClaseI aquí
        return of(clase); // `of` es un ejemplo, dependiendo de lo que hace `this.obtenerFechaYHora`
        });

        return forkJoin(gruposObservables);
      })
    );
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

  obtenerFechaYHora(timestamp: { seconds: number, nanoseconds: number }): Date {
    // Convierte el Timestamp a un objeto Date
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
}
}
