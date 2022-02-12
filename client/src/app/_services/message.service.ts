import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl ; 
  paginatedResult : PaginatedResult<Message[]> = new PaginatedResult<Message[]>(); 

  constructor(private http: HttpClient) { }

  getMessages(currentUserName: string,pageNumber :number, pageSize : number , container: string){
    let params = new HttpParams(); 

    params = params.append('Container' ,container) ;
    if(pageNumber !== null && pageSize !== null ){  
      params = params.append('PageNumber' ,pageNumber.toString()) ;
      params = params.append('PageSize',pageSize.toString());                                                                 
     }

    return this.http.get<Message[]>(this.baseUrl+ "messages/"+currentUserName ,
    {observe : 'response', params} ).pipe(
      map(response =>{
        this.paginatedResult.result = response.body as Message[] ; 

        if(response.headers.get('Pagination')!== null){
          //ovo je ono pagination sto nam stigne u headeru od responsa od servera gde imamo koliko
          //strana, koliko elemenata po strani , koliko ima ukupno elemenata itd...
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination') as string);
        }
        return this.paginatedResult ; 
      })
    );  
  }

  getMessageThread(currentUserName : string, recipientUserName : string){
    return this.http.get<Message[]>(this.baseUrl + "messages/thread/"+currentUserName+
           "/" +recipientUserName) ; 
  }

  sendMessage(currentUserName : string, recipientUserName : string , content :string){
    return this.http.post(this.baseUrl+"messages/"+currentUserName,
    {RecipientUsername : recipientUserName ,Content : content})
  }
  deleteMessage(currentUserName : string , messageId: number){
    return this.http.delete(this.baseUrl + "messages/"+currentUserName+"/"+messageId)
  }
}
