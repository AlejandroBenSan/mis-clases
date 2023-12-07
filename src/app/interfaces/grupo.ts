import { EstudianteI } from "./estudiante";

export interface grupoI {
    id?: string;
    nombre:string
    estudiantes: EstudianteI[]
    precio:number
    activo:boolean
  }