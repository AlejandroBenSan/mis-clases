import { Injectable } from '@angular/core';
import { diasClasesI } from '../interfaces/diasClases';

@Injectable({
  providedIn: 'root'
})
export class ServicioContabilidad {
  calcularIngresosYClasesPorMes(diasClases: diasClasesI[]): any[] {
    let ingresosPorMes: { 
      [key: number]: { 
        ingresosTotales: number, 
        ingresosRealizadas: number, 
        ingresosCanceladas: number, 
        totalClases: number, 
        clasesRealizadas: number, 
        clasesCanceladas: number 
      } 
    } = {};

    diasClases.forEach(dia => {
      const mes = dia.fecha.getMonth();
      dia.clases.forEach(clase => {
        if (!ingresosPorMes[mes]) {
          ingresosPorMes[mes] = { ingresosTotales: 0, ingresosRealizadas: 0, ingresosCanceladas: 0, totalClases: 0, clasesRealizadas: 0, clasesCanceladas: 0 };
        }

        let precio = clase.precio;
        if (typeof precio === 'string') {
          precio = parseFloat(precio);
        }

        if (!isNaN(precio)) {
          // Aumentar el contador de clases y sumar a ingresos totales
          ingresosPorMes[mes].totalClases++;
          ingresosPorMes[mes].ingresosTotales += precio;

          // Contar clases realizadas y canceladas, sumando a sus respectivos ingresos
          if (clase.estado === 'Realizada') {
            ingresosPorMes[mes].clasesRealizadas++;
            ingresosPorMes[mes].ingresosRealizadas += precio;
          } else if (clase.estado === 'Cancelada') {
            ingresosPorMes[mes].clasesCanceladas++;
            ingresosPorMes[mes].ingresosCanceladas += precio;
          }
        }
      });
    });

    return Object.keys(ingresosPorMes).map(mes => ({
      mes: parseInt(mes),
      ...ingresosPorMes[parseInt(mes)]
    }));
  }
}