import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

/*const httpOptions ={
  headers : new HttpHeaders({
    Authorization: "Bearer"+ JSON.parse(localStorage.getItem("user") as string)?.token
  })
} ovo smo mogli da koristimo i ovako da dodajemo rucno na request, ali sam koristio incerceptore
koji ce automatski da dodaju token na request header*/

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl ; 

  constructor(private http: HttpClient) { }

  getMembers(){
    return this.http.get<Member[]>(this.baseUrl+"user/" ); 
    //return this.http.get<Member[]>(this.baseUrl+"user/", httpOptions ); 
  }
  getMember(username: string){
    return this.http.get<Member>(this.baseUrl + "user/" + username ); 
    //return this.http.get<Member>(this.baseUrl + "user/" + username ,httpOptions); 
    }
}
