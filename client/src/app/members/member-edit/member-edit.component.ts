import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  member!: Member;
  user!: User;

  @ViewChild("editForm") editForm!: NgForm ; 

  constructor(private accountService:AccountService , private memberService: MembersService , 
    private toastr : ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user as User);
   }

  ngOnInit(): void {
    this.loadMember();
  }
  loadMember(){
    this.memberService.getMember(this.user?.userName as string).subscribe(member=>{
      this.member = member ; 
    })
  }

  updateMember(){
   this.memberService.updateMember(this.member).subscribe(()=>{});

    this.toastr.success("Profile Updated Succesfully");
    console.log(this.member);
    this.editForm.reset(this.member); //resetuje formu tj sad je onaj property dirty ponovo false  
  }

}
