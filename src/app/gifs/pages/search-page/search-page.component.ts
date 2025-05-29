import { Component, inject, signal } from '@angular/core';
import { ListComponent } from "../../components/list/list.component";
import { Gif } from '../../interfaces/gif.interface';
import { GifService } from '../../services/gifs.service';

@Component({
  selector: 'app-search-page',
  imports: [ListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent { 

  gifService = inject(GifService)
  gifList = signal<Gif[]>([])

  onSearch(query:string){
    this.gifService.getSearchGifs(query).subscribe( (resp) => 
      this.gifList.set(resp) 
  )}
  
}
