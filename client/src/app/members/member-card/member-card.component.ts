import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { AccountService } from 'src/app/_services/account.service';
import { take } from 'rxjs';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member : any;
  currentUser! : User ; 

  constructor(private memberService: MembersService, private toastr: ToastrService,
    private accountService: AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user =>{
        this.currentUser = user as User ;
      })
  }  
  ngOnInit(): void {
    
  }
  addLike(member : Member){
    this.memberService.addLike(this.currentUser.userName,member.userName).subscribe(()=>{
      this.toastr.success("You have liked"+member.knownAs) ; 
    })
  }

}



