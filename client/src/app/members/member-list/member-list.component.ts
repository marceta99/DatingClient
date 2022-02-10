import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members : Member[] = [];  
  pagination! : Pagination ;
  userParams! : UserParams ; 
  currentUser! : User; 
  genderList = [{value: "male" , display :"Males"}, {value : "female" , display : "Females"}]
 
  constructor(private memberService: MembersService, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user =>{
      this.currentUser = user as User ; 
      this.userParams = new UserParams(this.currentUser); //ovde smo koristli accountService jer nam je
                                                  //trebao trenutni korisnik da bi videli njegov pol
                                                  //i da bi to posle poslali u konstruktor queryParams
    })
   }

  ngOnInit(): void {
    this.loadMembers() ; 
  }

  loadMembers(){
    this.memberService.getMembers(this.currentUser.userName,this.userParams).subscribe
     (response =>{
      this.members = response.result ;
      this.pagination = response.pagination ; 
    })
  }
  pageChanged(event: any){
    this.userParams.pageNumber = event.page ; //znaci kad se klikne neka druga strana, samo se promeni broj
    this.loadMembers();  // strane i posaljemo novi http request pomocu loadMembers(). 
  }

  resetFilters(){
    this.userParams = new UserParams(this.currentUser); //resetujemo query params 
    this.loadMembers(); 
  }

}
