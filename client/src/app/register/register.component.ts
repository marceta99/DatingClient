import { Component, Input, OnInit, Output } from '@angular/core';

import { EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model : any = {};

  @Output() cancelRegister = new EventEmitter();
  constructor(private accountService: AccountService,private toastr : ToastrService) { }

  ngOnInit(): void {
  }
  register(){
    this.accountService.register(this.model).subscribe(
      { next: (response) =>{ 
        console.log("Register response : ");
        console.log(response);
        this.cancel();
      },
        error: (error) => {
          console.error(error)
          this.toastr.error(error.error); //ovaj toastr to smo instalirali poseban paket koji sluzi
                                        //da kad nam stigne response da je error da prikazemo u 
        }                               //prozorcicu koji iskoci sa strane tu gresku
    }
    )
  } 
    

  /*  */
  cancel(){
    this.cancelRegister.emit(false);
  }
}
