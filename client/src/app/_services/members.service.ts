import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';

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
  paginatedResult : PaginatedResult<Member[]> = new PaginatedResult<Member[]>(); 

  constructor(private http: HttpClient) { }

  getMembers(currentUserName :string ,userParams :UserParams){
    //if(this.members.length > 0)return of(this.members);
    //ovo gore if proverava da li smo vec jednom ucitali membere, i ako jesmo necemo vise da saljemo
    //nove http requestove vec cemo samo da vratimo membere koje smo sacuvali vec jednom u polje
    //members.Ali hocemo da te membere vratimo kao observable, a ne kao obican niz, pa cemo onda
    //da koristimo ovu metodu "of" iz rxjs koja ce da vrati observable od toga sto joj posaljemo
    
    let params = new HttpParams(); 

    if(userParams.pageNumber !== null && userParams.pageSize !== null ){
      params = params.append('PageNumber' ,userParams.pageNumber.toString()) ; //ovo kastujemo u string
      params = params.append('PageSize',userParams.pageSize.toString());//jer su query params
                                                                       //u stvari stringovi
     }//minAge, maxAge ,Gender vec imaju default vrednost tako da necu da ih proveravam dal su null
      params = params.append('MinAge',userParams.minAge.toString()) ; 
      params = params.append('MaxAge',userParams.maxAge.toString()) ; 
      params = params.append('Gender',userParams.gender) ; 
      params = params.append('OrderBy',userParams.orderBy) ; 
    //get metoda inace vraća body responsa koji dobijemo.Medjutim kada stavimo ovo observe i dodamo
    //query params, tada get metoda vraća ceo HTTP request, sto znaci da moramo mi sami da uzmemo body
    
    return this.http.get<Member[]>(this.baseUrl+"user/"+currentUserName,
     {observe : 'response', params} ).pipe(
      map(response =>{
        this.paginatedResult.result = response.body as Member[] ; 

        if(response.headers.get('Pagination')!== null){
          //ovo je ono pagination sto nam stigne u headeru od responsa od servera gde imamo koliko
          //strana, koliko elemenata po strani , koliko ima ukupno elemenata itd...
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination') as string);
        }
        return this.paginatedResult ; 
      })
    ); 


    //return this.http.get<Member[]>(this.baseUrl+"user/", httpOptions ); 
  }
  getMember(username: string){
    const member = this.members.find(x =>x.userName === username);
    if(member !== undefined)return of(member); //ponovo koristimo "of" da vratimo observable

    return this.http.get<Member>(this.baseUrl + "user/single/" + username ); 
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

  addLike(sourceUserName: string, likedUserName : string){
    return this.http.post(this.baseUrl + "likes/"+ sourceUserName+"/"+likedUserName,{}) ;
  }
  getLikes(sourceUserName: string, predicate : string){
    return this.http.get(this.baseUrl+ "likes/"+sourceUserName+"?predicate="+predicate); 
  }
}
