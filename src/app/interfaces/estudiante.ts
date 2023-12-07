export interface EstudianteI {
    id?: string;
    nombre: string;
    apellidos?: string;
    edad?: number;
    email?: string;
    telefono?: string;
    activo: boolean;
    precioClase: number;
    fechaIngreso?: Date; // La '?' indica que esta propiedad es opcional
  }