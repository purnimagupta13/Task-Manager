import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { App } from './app';
import { AppRoutingModule } from './app-routing.module';

import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { LoginComponent } from './authorization/login/login.component';
import { RegisterComponent } from './authorization/register/register.component';
import { ProfileInfoComponent } from './profile/profile-info/profile-info.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { TaskViewComponent } from './tasks/task-view/task-view.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { ForgotPasswordComponent } from './authorization/forgot-password/forgot-password.component';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';

@NgModule({
  declarations: [
    App,
    NavbarComponent,
    FooterComponent,
    NotFoundComponent,
    LoginComponent,
    RegisterComponent,
    ProfileInfoComponent,
    ChangePasswordComponent,
    UserProfileComponent,  
    TaskListComponent,
    TaskFormComponent,
    TaskViewComponent,
    DashboardComponent,
    UserManagementComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,     // ✅ fixes *ngIf, *ngFor, |date, etc.
    FormsModule,      // ✅ fixes [(ngModel)], #form="ngForm"
    RouterModule,     // ✅ fixes [routerLink], <router-outlet>
    AppRoutingModule  // ✅ routing
  ],
  providers: [DatePipe],
  bootstrap: [App]
})
export class AppModule { }
