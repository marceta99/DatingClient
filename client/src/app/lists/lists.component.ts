import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Member } from '../_models/member';
import { Pagination } from '../_models/pagination';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members! : Partial<Member[]> ; //ovde stavljamo partial jer ce ovo biti samo memberi koje je
  //korisnik lajkovao, a u njima necemo cuvati sve info o tim memberima vec samo neke propertyije, i zato je partial
  predicate = "liked" ;
  currentUser! : User; 
  pageNumber = 1 ; 
  pageSize = 5 ;
  pagination! : Pagination ;


  constructor(private memberService: MembersService,  private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user =>{
      this.currentUser = user as User ; 
  })
  }
  ngOnInit(): void {
    this.loadLikes() ; 
  }
  loadLikes(){
    this.memberService.getLikes(this.currentUser.userName,this.predicate,
      this.pageNumber,this.pageSize).subscribe(response =>{
      this.members = response.result ;
      this.pagination = response.pagination ; 
    })
  }
  pageChanged(event : any){
    this.pageNumber = event.page ; 
    this.loadLikes(); 
  }

}
