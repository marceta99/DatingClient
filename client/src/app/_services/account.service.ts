import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl=environment.apiUrl; 
  currentUserSource = new ReplaySubject<User | null>(1);//ovo jedan je velicina buffera
  currentUser$ =  this.currentUserSource.asObservable();
  public isLoggedIn =true;//= false ; 

  constructor(private http: HttpClient) { }

  login(model : any){
    return this.http.post<User>(this.baseUrl+"account/login", model).pipe(
      map( (response : User) =>{
        const user = response; 
        if(user){
          localStorage.setItem('user',JSON.stringify(user)) //cuva ovog usera u local storage browsera
                 //i to se cuva kao key value pairs gde je 'user' key, a ovaj objekat user koji smo
                //strigify u string, on je value
          this.setCurrentUser(user);
          this.isLoggedIn = true ; 
              }})
                )
  }
  setCurrentUser(user : User){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user'); //ovde brisemo tog usera iz local storage kad se izloguje 
    this.currentUserSource.next(null);
    this.isLoggedIn = false ; 
  }
  register(model : any){
    return this.http.post<User>(this.baseUrl+"account/register", model).pipe(
      map( (response : User) =>{
        const user = response; 
        if(user){
          localStorage.setItem('user',JSON.stringify(user))
          //this.currentUserSource.next(user);
          this.setCurrentUser(user);
          this.isLoggedIn = true ; 
              }
          return response ; 
            })
                )
  }
}
