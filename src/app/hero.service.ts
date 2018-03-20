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
  // Observable (可观察对象): 表示一个概念，这个概念是一个可调用的未来值或事件的集合。
  // Observer (观察者): 一个回调函数的集合，它知道如何去监听由 Observable 提供的值。
  // Subscription (订阅): 表示 Observable 的执行，主要用于取消 Observable 的执行。
  // Operators (操作符): 采用函数式编程风格的纯函数 (pure function)，使用像 map、filter、concat、flatMap 等这样的操作符来处理集合。
  // Subject (主体): 相当于 EventEmitter，并且是将值或事件多路推送给多个 Observer 的唯一方式。
  // Schedulers (调度器): 用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 setTimeout 或 requestAnimationFrame 或其他。

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
  searchHeroes(term:string):Observable<Hero[]>{
    if(!term.trim()){
      return of([]);
    }
    return this.http.get<Hero[]>(`api/heroes/?name=${term}`).pipe(
      tap(_=>this.log(`found heroes matched ${term}`)),
      catchError(this.handleError<Hero[]>(`searchHeroes`,[]))
    )
  }
  private log(message:string){
      this.messageService.add('HeroService:'+message)
  }

}
