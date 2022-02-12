import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientUserName! : string ; 
  @ViewChild("messageForm") messageForm! :NgForm ; 
  messages! : any ;  
  currentUser!: User ; 
  messageContent! : string ; 

  constructor(private messageService : MessageService, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user =>{
      this.currentUser = user as User ; 
   })
  }

  ngOnInit(): void {
    this.loadMessages() ;
  }
  loadMessages(){
    this.messageService.getMessageThread(this.currentUser.userName,this.recipientUserName)
      .subscribe(messages =>{
        this.messages = messages;
      })
  }
  sendMessage(){
    this.messageService.sendMessage(this.currentUser.userName,this.recipientUserName,
      this.messageContent).subscribe(message =>{
        this.messages.push(message);
        this.messageForm.reset();
      })
  }
  

}
