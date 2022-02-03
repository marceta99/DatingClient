import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements OnInit {

  error: any ; 

  //i ovaj router koristimo da pristupimo state-u odnosno onome sto smo slali u error.interceptoru 
  //u slucaju kad je bila greska 500. Tome moze da se pristupi samo u konstruktoru dok u ngOnIniti
  // ne moze .  
  constructor(private router: Router) { 
    const navigation = this.router.getCurrentNavigation();

    this.error = navigation?.extras?.state?.error; //ovo je neka glupost sa najnovijim angularom
  }                                                    //u sustini isto kao da je state?.error

  ngOnInit(): void {
  }

}
