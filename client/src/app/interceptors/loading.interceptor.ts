import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, finalize, Observable } from 'rxjs';
import { BusyService } from '../_services/busy.service';

@Injectable()
export class LoadinggInterceptor implements HttpInterceptor {

  constructor(private busyService : BusyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.busyService.busy(); //ovo pokrece onaj spiner kad posaljemo http request
   
    return next.handle(request).pipe(
      delay(1000),//ovaj operator odlaze http request za 1 sekundu da bi dobili neki real life user experience
      finalize(()=>{ //ovaj operator finalize se pokrece kada se http request zavrsi 
        this.busyService.idle(); //ovo gasi spinner kad se zavrsi request
      })
    );
  }
}
