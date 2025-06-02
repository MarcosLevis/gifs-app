import { Injectable, signal } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ScrollStateService {

    //es raro que sea tan publica la senial y brinde posibilidad a todos de modificarla.
    //Se podria hacer un poco mas privada para generar menos 'acomplamiento' tal vez?
    trendingScrollState = signal(0)
}