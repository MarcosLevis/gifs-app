import { Component } from '@angular/core';
// no se pone el environment.development porque eso despues es cambiado automaticamente
import { environment } from '@environments/environment';
// import { environment } from '../../../../environments/environment';

@Component({
  selector: 'gifs-side-menu-header',
  imports: [],
  templateUrl: './side-menu-header.component.html',
})
export class SideMenuHeaderComponent { 

  envs = environment;

}
