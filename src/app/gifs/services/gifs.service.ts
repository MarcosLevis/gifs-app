import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '@environments/environment';
import { GifMapper } from '../mapper/gif.mapper';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import type { Gif } from '../interfaces/gif.interface';

@Injectable({providedIn: 'root'})

export class GifService {

    private http = inject(HttpClient)

    trendingGifs = signal<Gif[]>([])
    searchGifs = signal<Gif[]>([])
    trendingGifsLoading = signal(true)
    searchGifsLoading = signal(true)

    searchHistory = signal<Record<string,Gif[]>>({})
    searchHistoryKeys = computed(() => Object.keys(this.searchHistory()))

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
    
    getSearchGifs(query: string): Observable<Gif[]>{
       return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`,{
            params: {
                api_key: environment.apiKey,
                q: query,
                limit: 20
            }
        })
        .pipe(
            map(({ data })=> data),
            map( (items) => GifMapper.mapGiphyItemsToGifArray(items)),
            tap( items =>{ 
                this.searchHistory.update(history => ({...history, [query.toLowerCase()]: items }))
            }),
            
        );
        
    }
    loadToLocalStorage = effect(() => {  
        console.log('TU VIEJA')
        if (this.searchHistory()){
            const i = Object.keys(this.searchHistory()).length - 1
            const key = Object.keys(this.searchHistory())[i] //.toString()
            const value = JSON.stringify(Object.values(this.searchHistory())[i])
            // console.log(value)
            localStorage.setItem(key,value)
        }
    })

    getHistoryGifs(query: string): Gif[]{
        return this.searchHistory()[query] ?? []
    }
}