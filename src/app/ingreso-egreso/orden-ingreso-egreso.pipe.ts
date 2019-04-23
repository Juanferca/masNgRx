import { IngresoEgreso } from './ingreso-egreso.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenIngresoEgreso'
})
export class OrdenIngresoEgresoPipe implements PipeTransform {

  transform( items: IngresoEgreso[]): IngresoEgreso[] {
    return items.sort( (a,b) => {
      if( a.tipo === 'ingreso') {
        return -1;
      } else {
        return 1;
      }
    })
  }

}
