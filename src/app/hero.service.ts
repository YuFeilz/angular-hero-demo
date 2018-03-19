import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError,map,tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { Observer } from 'rxjs/Observer';

const httpOptions={
  headers:new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable()
export class HeroService {
  private heroesUrl='api/heroes';
  private handleError<T>(operation='operation',result?:T){
    return (error:any):Observable<T>=>{
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  constructor( 
    private http:HttpClient,
    private messageService:MessageService) { }
  getHeroes():Observable<Hero[]>{
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(heroes=>this.log('fetched heroes')),
      catchError(this.handleError('getHeroes',[]))
    );
  }
  getHero(id: number): Observable<Hero> {
    const url=`${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_=>this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }
  updateHero(hero:Hero):Observable<any>{
    return this.http.put(this.heroesUrl,hero,httpOptions).pipe(
      tap(_=>this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>(`updateHeroes`))
    )
  }
  addHero(hero:Hero):Observable<Hero>{
    return this.http.post(this.heroesUrl,hero,httpOptions).pipe(
      tap((hero:Hero)=>this.log(`add hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }
  deleteHero(hero:Hero | number):Observable<Hero>{
    const id=typeof hero==='number'?hero:hero.id;
    const url=`${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url,httpOptions).pipe(
      tap(_=>this.log(`delete hero id=${id}`)),
      catchError(this.handleError<Hero>(`deletHero`))
    )
  }
  private log(message:string){
      this.messageService.add('HeroService:'+message)
  }

}
