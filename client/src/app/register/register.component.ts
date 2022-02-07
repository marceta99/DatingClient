import { Component, Input, OnInit, Output } from '@angular/core';

import { EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 
  registerForm! : FormGroup ; 
  todayDate = new Date();
  valdationErrors: string[]=[]; //ovo su greske koje vrati server , npr korisnicko ime već postoji itd

  @Output() cancelRegister = new EventEmitter();
  constructor(private accountService: AccountService,private toastr : ToastrService ,
    private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    console.log(this.registerForm);
  }
  initializeForm(){
    this.registerForm = new FormGroup({
      userName : new FormControl(null,Validators.required),
      password : new FormControl(null , [Validators.required,Validators.minLength(2),Validators.maxLength(15)]),
      confirmPassword : new FormControl(null,[Validators.required,this.matchValues.bind(this)]), 
      gender : new FormControl("male",Validators.required),
      knownAs : new FormControl("",Validators.required),
      dateOfBirth : new FormControl(null,Validators.required),
      city : new FormControl("",Validators.required),
      country : new FormControl("",Validators.required),
    })
    
    this.registerForm.controls.password.valueChanges.subscribe(()=>{
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
      //ovo ce ponovo da proveri validaciju confirmPasswroda kada se promeni password jer 
      //postojace situacije kada ce da bude dobar confirmPassword, a onda korsinik ode i promeni 
      //nesto ponovo na passwordu. Tada ce i dalje da bude confirmPassword dobar iako ne bi trebao 
      //pa cemo zato u svim situacijama kada se menja password da proveravamo ponovo i confirmPassword
    })
  }
  matchValues(control:FormControl):{[s:string] : boolean} |null {
    if(this.registerForm?.controls?.confirmPassword?.value !==
       this.registerForm?.controls?.password?.value)return{"passwordIsCorrect":false}
       return null ; 
  }

  register(){
    this.accountService.register(this.registerForm.value).subscribe(
      { next: (response) =>{ 
        console.log("Register response : ");
        console.log(response);
        this.router.navigateByUrl("/members");
        this.cancel();
      },
        error: (error) => {
          console.error(error)
          this.valdationErrors = error ; 
        }                               
    }
    )
  } 
  /*  */
  cancel(){
    this.cancelRegister.emit(false);
  }
}
