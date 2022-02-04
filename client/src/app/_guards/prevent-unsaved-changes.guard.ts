import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {
  canDeactivate(component: MemberEditComponent): boolean {
    if(component.editForm.dirty){ //ovde proveravamo da li je imao neke promene nad formom
      return confirm("Are you sure that you want to leave. Any unsaved changes will be lost") 
    }
    return true ; //ako nije imao nikakve promene nad formom onda samo vracamo true tj moze
                  //moze slobodno da napusti rutu jer nista nije ni menjao u toj formi 
  }

  
}
