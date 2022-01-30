import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';
import {map} from 'rxjs/operators'  ; 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountService : AccountService, private router : Router) {
  }
  canActivate(): boolean {
    if(this.accountService.isLoggedIn){
      return true ; 
    }else {
      this.router.navigate(["/"]) ;
      return false ; 
    }
  }

  
}
