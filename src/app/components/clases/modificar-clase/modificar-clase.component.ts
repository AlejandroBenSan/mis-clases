import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, forkJoin, map, of, take } from 'rxjs';
import { ClaseI } from 'src/app/interfaces/clase';
import { EstudianteI } from 'src/app/interfaces/estudiante';
import { GrupoI } from 'src/app/interfaces/grupo';
import { diasClasesI } from 'src/app/interfaces/diasClases';
import { AjustesI } from 'src/app/interfaces/ajustes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

@Component({
  selector: 'app-modificar-clase',
  templateUrl: './modificar-clase.component.html',
  styleUrls: ['./modificar-clase.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ModificarClaseComponent implements OnInit{

  @ViewChild('checkEstudiantes') checkboxEstudiantes!: MatCheckbox;
  cargando: boolean = false;

  claseForm: FormGroup;
  clase: ClaseI;
  tipoClase: string;
  grupo!: Observable<any>;
  grupoNoSeleccionado: GrupoI[] = []
  selectedEstudents!: string[]
  time = { hour: new Date().getHours(), minute: new Date().getMinutes()};
  diasClases: diasClasesI[] = [];
  //AJUSTES
  ajustes!: AjustesI

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<ModificarClaseComponent>,
    private firestore: AngularFirestore, private snackBar: MatSnackBar){
    
    console.log(data)

    //Comprobamos el tipo de la clase
    this.tipoClase = this.tipoClaseFunc(data.clase)
    //Guardamos los datos de la clase
    this.clase = data.clase;
    //Guardamos los datos de las clases
    this.diasClases = data.diasClases
    //Obtenemos los datos del grupo
    this.time = {hour: data.clase.fechaHora.getHours(), minute: data.clase.fechaHora.getMinutes()}

    this.claseForm = this.fb.group({
      estudiante: [''],
      grupo: [''],
      fechaHora: [data.clase.fechaHora, Validators.required],
      duracion: [data.clase.duracion, Validators.required],
      precio: [data.clase.precio, [Validators.required, Validators.min(0)]],
      contenido: [data.clase.contenido],
      deberes: [''],
      estado: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    
    if(this.tipoClase == "Grupo"){
      this.grupo = this.obtenerDatosGrupo(this.clase.nombreGrupo!)
      this.obtenerAjustes();
      this.cargarDatos()
    }else{
      this.obtenerAjustes();
    }
  }

  isClaseDay2: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
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
            return 'custom-date-class2';
          }
        }
      }
    }
  
    return '';
  };

  tipoClaseFunc(data: any): string{
    if(data.idParticular == ""){
      return "Grupo"
    }else{
      return "Particular"
    }
  }

  obtenerAjustes(){
    this.firestore.collection('ajustes').get().subscribe(snapshot => {
      snapshot.forEach(doc => {
        this.ajustes = doc.data() as AjustesI;

      });
    });
  }

  cargarDatos() {
    this.grupo.subscribe(grupo => {
      this.grupoNoSeleccionado = grupo;
  
      this.obtenerEstudiantesDelGrupo(this.grupoNoSeleccionado[0].estudiantesIds).subscribe(estudiantes => {
        this.grupoNoSeleccionado[0].estudiantes = estudiantes;
      });
  
      this.comprobarNumEstudiantes();

      this.selectedEstudents = this.clase.estudiantesIds!
    });
  }


  //COMPROBAMOS SI LA CLASE DE GRUPO TIENE TODOS SUS ESTUDIANTES
  comprobarNumEstudiantes(){
    if(this.clase.estudiantesIds?.length == this.grupoNoSeleccionado[0].estudiantesIds.length){
      this.checkboxEstudiantes.checked = true
    }else{
      this.checkboxEstudiantes.checked = false
    }
  }

  estudiantesSeleccionadosClase(event: any){
    if(event.value.length == this.grupoNoSeleccionado[0].estudiantesIds.length){
      this.checkboxEstudiantes.checked = true
    }

    this.selectedEstudents = event.value
  }

  //OBTENEMOS LOS ESTUDIANTES DEL GRUPO
  private obtenerEstudiantesDelGrupo(estudiantesIds: string[]): Observable<EstudianteI[]> {
    
    if(estudiantesIds == null){
      estudiantesIds = []
      if (estudiantesIds.length === 0) {
        // Si no hay estudiantes, retorna un observable vacío
        return of([]);
      }
    }
  
    const estudiantesObservables = estudiantesIds
    .filter(id => id)  // Filtra IDs no válidos o vacíos
    .map(id => 
      this.firestore.collection('estudiantes').doc(id).snapshotChanges().pipe(
        map(action => {
          // Obtener los datos del estudiante y agregar el ID
          const datos = action.payload.data() as EstudianteI;
          return { ...datos, id };  // Combina los datos del estudiante con su ID
        }),
        take(1)
      )
    );
  
    return forkJoin(estudiantesObservables);
  }

  obtenerDatosGrupo(nombre: string): Observable<any> {
    return this.firestore.collection('grupos', ref => ref.where('nombre', '==', nombre))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  guardarClaseModificada(){

    this.cargando = true;

    const grupoData = this.claseForm.value;

    if(this.claseForm.get('precio')!.value == "" || this.claseForm.get('precio')!.value == null || this.claseForm.get('precio')!.value < 0){
      this.snackBar.open('El precio no puede estar vacío o ser inferior a 0', 'Cerrar', {
        duration: 3000,
      });
      this.cargando = false;
      return;
    }

    if(this.tipoClase == "Grupo"){
      if(this.selectedEstudents.length < 1){
        this.snackBar.open('El grupo no puede estar vacío', 'Cerrar', {
          duration: 2000,
        });
        this.cargando = false;
        return;
      }
    }

    if(this.claseForm.get('fechaHora')!.value == null){
      this.snackBar.open('Debe seleccionar una fecha', 'Cerrar', {
        duration: 2000,
      });
      this.cargando = false;
      return;
    }

    if (this.time == null || this.time.hour == null || this.time.minute == null) {
      this.snackBar.open('Debe seleccionar tanto hora como minutos de la clase', 'Cerrar', {
        duration: 2000,
      });
      this.cargando = false;
      return;
    }

    if(this.claseForm.get('duracion')!.value == "" || this.claseForm.get('duracion')!.value == null || this.claseForm.get('duracion')!.value < 1){
      this.snackBar.open('La duración no puede estar vacía, ser 0 o inferior a 0.', 'Cerrar', {
        duration: 3000,
      });
      this.cargando = false;
      return;
    }

    let fecha = this.claseForm.get('fechaHora')!.value;
    let fechaConHora = new Date(fecha);

    // Obtener las horas y minutos del objeto 'time'
    let horas = this.time.hour;
    let minutos = this.time.minute;

    // Establecer las horas y minutos en el objeto Date
    fechaConHora.setHours(horas, minutos);

    const conflictoClase = this.verificarConflictoDeClases(fechaConHora,this.claseForm.get('duracion')!.value, this.clase)

    if(conflictoClase){
      this.cargando = false;
      return;
    }
    else{
      grupoData.fechaHora = fechaConHora;
      grupoData.estado = "Activo"

      //Para que no de error al leer la clase de campo null
      if(grupoData.estudiantesIds == null){
        grupoData.estudiantesIds = []
      }

      //INICIALIZAMOS PARA NO TENER PROBLEMA A LA HORA DE LEER LAS CLASES
      if(grupoData.grupo == null){
        grupoData.grupo = ""
      }

      if(grupoData.estudiante == null){
        grupoData.estudiante = ""
      }
      //GUARDAMOS LOS ESTUDIANTES QUE VAN A PARTICIPAR EN LA CLASE
      let estudiantesGrupo: string[] = []

      if(this.tipoClase == "Grupo"){
        grupoData.grupo = this.clase.idGrupo

        if(this.checkboxEstudiantes.checked){
          estudiantesGrupo = this.grupoNoSeleccionado[0].estudiantesIds
        }
        else{
          estudiantesGrupo = this.selectedEstudents
        }
      }else{
        grupoData.estudiante = this.clase.idParticular
        estudiantesGrupo = []
      }

      const datosfirebase = {
        contenido: grupoData.contenido,
        deberes: "",
        documentos: "",
        duracion: grupoData.duracion,
        estado: grupoData.estado,
        estudiantesIds: estudiantesGrupo,
        fechaHora: grupoData.fechaHora,
        idParticular: grupoData.estudiante,
        idGrupo: grupoData.grupo,
        precio: grupoData.precio
      }

      console.log(datosfirebase)

      this.actualizarClase(datosfirebase)
    }
  }

  actualizarClase(datos: any){
    this.firestore.collection('clases').doc(this.clase.id).update({
      contenido: datos.contenido,
      deberes: "",
      documentos: "",
      duracion: datos.duracion,
      estado: datos.estado,
      estudiantesIds: datos.estudiantesIds,
      fechaHora: datos.fechaHora,
      idGrupo: datos.idGrupo,
      idParticular: datos.idParticular,
      precio: datos.precio
    })
    .then(() => {
      console.log('Clase actualizada con éxito');
      this.snackBar.open('La clase se ha actualizado con éxito', 'Cerrar', {
        duration: 2000,
      });
      this.cargando = false;
      this.dialogRef.close()
    })
    .catch(error => {
      console.log('Error al actualizar estudiante: ', error);
      this.snackBar.open('Error al actualizar la clase', 'Cerrar', {
        duration: 2000,
      });
      this.cargando = false;
    });
  }

  //COMPROBAMOS QUE NO EXISTA UNA CLASE EN ESE PERIODO DE TIEMPO
  //TENIENDO EN CUENTA DE QUE NO SE TRATE DE LA MISMA HORA DE LA CLASE QUE SE QUIERE MODIFICAR
  verificarConflictoDeClases(nuevaClaseFechaHora: any, nuevaClaseDuracion: any, claseModificando: ClaseI) {
    for (let i = 0; i < this.diasClases.length; i++) {
        for (let j = 0; j < this.diasClases[i].clases.length; j++) {
            let claseExistente = this.diasClases[i].clases[j];

            // Agregar condición para verificar si es la misma clase que se está modificando
            if (claseExistente.id === claseModificando.id) {
                continue; // Saltar la iteración si es la misma clase
            }

            let inicioExistente = claseExistente.fechaHora;
            let finExistente = new Date(inicioExistente.getTime() + claseExistente.duracion * 60000);

            let inicioNueva = nuevaClaseFechaHora;
            let finNueva = new Date(inicioNueva.getTime() + nuevaClaseDuracion * 60000);

            // Determinar cuál clase comienza primero
            if (inicioExistente <= inicioNueva) {
                // Sumar el tiempo de descanso a la clase existente
                finExistente = new Date(finExistente.getTime() + this.ajustes.tiempoEntreClases * 60000);
            } else {
                // Sumar el tiempo de descanso a la nueva clase
                finNueva = new Date(finNueva.getTime() + this.ajustes.tiempoEntreClases * 60000);
            }

            if (inicioNueva < finExistente && finNueva > inicioExistente) {
                this.snackBar.open('Ya tienes una clase dentro del periodo de la nueva clase', 'Cerrar', {
                    duration: 2000,
                });
                return true; // Hay un conflicto
            }
        }
    }
    return false; // No hay conflicto
  } 
}
