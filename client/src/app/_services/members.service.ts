import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { User } from '../_models/user';

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
  members: Member[]=[];

  constructor(private http: HttpClient) { }

  getMembers(){
    if(this.members.length > 0)return of(this.members);
    //ovo gore if proverava da li smo vec jednom ucitali membere, i ako jesmo necemo vise da saljemo
    //nove http requestove vec cemo samo da vratimo membere koje smo sacuvali vec jednom u polje
    //members.Ali hocemo da te membere vratimo kao observable, a ne kao obican niz, pa cemo onda
    //da koristimo ovu metodu "of" iz rxjs koja ce da vrati observable od toga sto joj posaljemo

    return this.http.get<Member[]>(this.baseUrl+"user/" ).pipe(
      map((members : Member[]) =>{
        this.members = members; 
        return members ;
      })
    ); 


    //return this.http.get<Member[]>(this.baseUrl+"user/", httpOptions ); 
  }
  getMember(username: string){
    const member = this.members.find(x =>x.userName === username);
    if(member !== undefined)return of(member); //ponovo koristimo "of" da vratimo observable

    return this.http.get<Member>(this.baseUrl + "user/" + username ); 
    //return this.http.get<Member>(this.baseUrl + "user/" + username ,httpOptions); 
    }
  updateMember(member : Member){
    return this.http.put(this.baseUrl + "user/"+member.userName , member).pipe(
      map(()=>{
        const index = this.members.indexOf(member);
        this.members[index] = member ; //hocemo da update-tujemo tog membera u nizu, kada posaljemo
                                      //put request 
      })
    ); 
  }
  setMainPhoto(photoId: number,user :User){
    return this.http.put(this.baseUrl + "user/set-main-photo/"+user.userName+"/"+photoId, {})
  }
  deletePhoto(photoId : number,user :User){
    return this.http.delete(this.baseUrl+ "user/delete-photo/"+user.userName + "/"+photoId) ; 
  }

}
