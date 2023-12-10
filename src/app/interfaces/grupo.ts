import { EstudianteI } from "./estudiante";

export interface GrupoI {
    id?: string;
    nombre:string
    estudiantes?: EstudianteI[]
    precio:number
    activo:boolean
  }