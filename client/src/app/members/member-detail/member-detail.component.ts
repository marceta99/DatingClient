import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild("memberTabs") memberTabs! :TabsetComponent ; 
  activeTab! : TabDirective ; //ovo TabDirective i TabsetComponent dolaze iz paketa ngx/bootstrap
  displayMessagesTab: boolean = false; 
  member!: Member;
  galleryOptions! : NgxGalleryOptions[];
  galleryImages! : NgxGalleryImage[]; 


  constructor(private memberService : MembersService , private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      params.tab ? this.selectTab(params.tab) : this.selectTab(0) ;
    })

    this.loadMember(); 

    this.galleryOptions = [
      {
        width : "500px",
        height: "500px",
        imagePercent: 100, 
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide ,
        preview: false 
      }
    ]
  }

  getImages(): NgxGalleryImage[]{
    const imageUrls = []; 
    for(const photo of this.member.photos){
      imageUrls.push({
        small: photo?.url ,
        medium: photo?.url ,
        big: photo?.url
      })
    }
    return imageUrls;
  }

  loadMember(){
    this.memberService.getMember(this.route.snapshot.paramMap.get("userName") as string).subscribe(
      member =>{
        this.member = member ;
        this.galleryImages = this.getImages(); 
      }
    )
  }
  onTabActivated(data : TabDirective){
    this.activeTab = data ; 
    if(this.activeTab.heading === "Messages"){
      this.displayMessagesTab = true ;  
    }
  }
  selectTab(tabId :number){
    if( this.memberTabs &&this.memberTabs.tabs){
      this.memberTabs.tabs[tabId].active = true ; 
  }
}

}
