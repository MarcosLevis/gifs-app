import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map } from 'rxjs';

@Injectable({providedIn: 'root'})

export class GifService {

    private http = inject(HttpClient)

    trendingGifs = signal<Gif[]>([])
    searchGifs = signal<Gif[]>([])
    trendingGifsLoading = signal(true)
    searchGifsLoading = signal(true)


    constructor(){
        this.getTrendingGifs();
    }

    getTrendingGifs(){
        this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
            params: {
                api_key: environment.apiKey,
                limit: 20,
            }
        }).subscribe((resp) => {
            const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data)
            this.trendingGifs.set(gifs)
            this.trendingGifsLoading.set(false)
        })
    }
    
    getSearchGifs(query: string){
       return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`,{
            params: {
                api_key: environment.apiKey,
                q: query,
                limit: 20
            }
        })
        .pipe(
            map(({ data })=> GifMapper.mapGiphyItemsToGifArray(data))
        ); 

        //TODO: Historial
    }
}