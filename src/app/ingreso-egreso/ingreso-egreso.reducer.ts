

import * as fromIngresoEgreso from './ingresp-egreso.actions';
import { IngresoEgreso } from './ingreso-egreso.model';
import { isNgTemplate } from '@angular/compiler';
import { UNSET_ITEMS } from './ingresp-egreso.actions';


export interface IngresoEgresoState {
            items: IngresoEgreso[];
}

const estadoInicial: IngresoEgresoState = {
    items:[]
}

export function ingresoEgresoReducer(state = estadoInicial, action: fromIngresoEgreso.acciones): IngresoEgresoState {

    switch( action.type ) {

        case fromIngresoEgreso.SET_ITEMS:
         return {
            items: [
                ...action.items.map( item => {
                    return {
                        ...item
                        }
                    })
                ]
             }

         case fromIngresoEgreso.UNSET_ITEMS:
             return {
                 items: []
             }

        default:
        return state;
    }
}