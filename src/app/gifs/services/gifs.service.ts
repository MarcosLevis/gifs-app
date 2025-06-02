import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '@environments/environment';
import { GifMapper } from '../mapper/gif.mapper';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import type { Gif } from '../interfaces/gif.interface';

const loadFromLocalStorage = () =>{
    const gifsFromLocalStorage = localStorage.getItem('gifs') ?? '{}';
    const gifs = JSON.parse(gifsFromLocalStorage)
    return gifs
}
@Injectable({providedIn: 'root'})

export class GifService {

    private http = inject(HttpClient)

    trendingGifs = signal<Gif[]>([])
    searchGifs = signal<Gif[]>([])
    trendingGifsLoading = signal(false)
    searchGifsLoading = signal(true)
    private currentPage = signal(0)

    trendingGifGroup = computed<Gif[][]>(() => {
        const groups = []
        for ( let i = 0; i < this.trendingGifs().length; i += 3){
            groups.push(this.trendingGifs().slice(i,i + 3))
        }
        return groups
    })

    searchHistory = signal<Record<string,Gif[]>>(loadFromLocalStorage())
    searchHistoryKeys = computed(() => Object.keys(this.searchHistory()))

    constructor(){
        this.getTrendingGifs();
    }

    getTrendingGifs(){

        if(this.trendingGifsLoading()) return

        this.trendingGifsLoading.set(true)

        this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
            params: {
                api_key: environment.apiKey,
                limit: 20,
                offset: this.currentPage() * 20
            }
        }).subscribe((resp) => {
            const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data)
            this.trendingGifs.update(currentGifs => [...currentGifs, ...gifs])
            this.currentPage.update(current => current + 1)
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
        const historyString = JSON.stringify(this.searchHistory());
        localStorage.setItem('gifs',historyString)
    })

    getHistoryGifs(query: string): Gif[]{
        return this.searchHistory()[query] ?? []
    }
}