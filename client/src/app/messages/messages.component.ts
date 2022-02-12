import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages! : any; 
  pagination! : Pagination ; 
  container = "Inbox" ;
  pageNumber = 1 ; 
  pageSize = 5 ; 
  currentUser!: User; 

  constructor(private messageService : MessageService, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user =>{
      this.currentUser = user as User ; 
   })
  }

  ngOnInit(): void {
    this.loadMessages();
  }
  loadMessages(){
    this.messageService.getMessages(this.currentUser.userName ,this.pageNumber ,
      this.pageSize, this.container).subscribe(response =>{
        this.messages = response.result ; 
        this.pagination = response.pagination ; 
      })

  }

  pageChanged(event : any){
    if(this.pageNumber !== event.page)
    {
      this.pageNumber = event.page ; 
      this.loadMessages();
    }
  }
  deleteMessage(messageId : number){
    this.messageService.deleteMessage(this.currentUser.userName, messageId).subscribe(()=>{
      this.messages.splice(this.messages.findIndex((m : any)=> m.id === messageId), 1);  
    })
  }
}
