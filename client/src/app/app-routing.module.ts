import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';

const routes: Routes = [
  {path : 'members', component: MemberListComponent, canActivate: [AuthGuard]},
  {path : 'members/:userName', component: MemberDetailComponent,  canActivate: [AuthGuard]},
  {path : 'member/edit', component: MemberEditComponent,  canActivate: [AuthGuard] ,
    canDeactivate:[PreventUnsavedChangesGuard] },
  {path : 'lists', component: ListsComponent,  canActivate: [AuthGuard]},
  {path : 'messages', component: MessagesComponent,  canActivate: [AuthGuard]},
  {path : '', component: HomeComponent},
  {path: 'errors', component :TestErrorsComponent},
  {path: 'server-error', component :ServerErrorComponent},
  {path: 'not-found', component :NotFoundComponent},
  {path : '**', component: NotFoundComponent, pathMatch : 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
