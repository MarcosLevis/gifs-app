import {  Component, input } from '@angular/core';
import { ListItemComponent } from './list-item/list-item.component';

@Component({
  selector: 'gif-list',
  imports: [ListItemComponent],
  templateUrl: './list.component.html',
})
export class ListComponent {

  imageUrlsList = input.required<string[]>(); 
  
}
