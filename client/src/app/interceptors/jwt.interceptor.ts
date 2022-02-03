import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';



//pomocu ovog interceptora cemo na svakom http requestu da dodajemo header koji ce da nosi jwt token
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService : AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser  = {token : ""} //ovo sam ja nesto morao da improvizujem zbog nekih glupih greski

    //ovo pipe(take(1)) mozemo da koristimo da se automatski unsubscribujemo cim dobijemo jedan
    //observable. Tako da samim tim ne moramo mi da se kasnije unsubscribujemo rucno 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      currentUser  = user as User ; 
    })

    if(currentUser?.token){ //ako postoji trenutno ulogovan user onda cemo da u svakom headeru http  
                                  // requesta saljemo i token tog usera pomocu ovog interceptora
      request = request.clone({
        setHeaders: {
          Authorization : `Bearer ${currentUser.token}`
        }
      })
    } 
    return next.handle(request);
  }
}
