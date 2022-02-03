import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  //u nekim slucajevima kada pukne greska hocemo samo da prebacumo koristinika na odredjenu rutu
  //i zato smo injectali ovaj router
  constructor(private router: Router , private toastr : ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error =>{
        if(error){
          switch(error.status){
            case 400: //kod 400 imamo dva slucaja kada puca ta greska.Prvi je kad dobijemo biz greski
              if(error.error.errors){ //to je ovo sa vise greski
                const modalStateErrors = []; 
                for(const key in error.error.errors){
                  if(error.error.errors[key]){
                    modalStateErrors.push(error.error.errors[key])
                  }
                }
                throw modalStateErrors.flat();
              }else { //a ovo je kad dobijemo samo jednu gresku
                this.toastr.error(error.statusText, error.status) ;
              }
            break ; 
            case 401: 
              this.toastr.error(error.statusText, error.status);
              break ; 
            case 404: 
              this.router.navigateByUrl("/not-found") ; 
              break ; 
            case 500: 
            //ovo navigationExtras koristimo da prosledimo neke dodatne podatke na tu rutu gde idemo
            //i to saljemo kao ovaj state 
              const navigationExtras: NavigationExtras = {state : {error : error.error}};
              
              this.router.navigateByUrl("/not-found", navigationExtras) ; 
              break ; 
            default: 
              this.toastr.error("Something unexpected went wrong") ;
              console.log(error);
            break;  
          }
        }

        return throwError(() => new Error('test')); //ako slucajno nismo uhvatili gresku u nekom case-u 
                                  //onda vracamo to sto smo u stvari
                                  //i dobili od servera . 
      })
    );
  }
}
