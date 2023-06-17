import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/users/home/home.component';
import { LoginComponent } from './component/users/login/login.component';
import { RegisterComponent } from './component/users/register/register.component';
import { ProfileComponent } from './component/users/profile/profile.component';
import { RegisterClubComponent } from './component/users/register-club/register-club.component';
import { JoinClubComponent } from './component/users/join-club/join-club.component';
import { ClubHomeComponent } from './component/users/club-home/club-home.component';
import { ClubProfileComponent } from './component/users/club-profile/club-profile.component';
import { FinanceComponent } from './component/users/finance/finance.component';
import { MembersComponent } from './component/users/members/members.component';
import { userProfile } from './component/userState/app.selectctor';
import { UserProfileComponent } from './component/users/user-profile/user-profile.component';
import { SettingsComponent } from './component/users/settings/settings.component';
import { EmailValidator } from '@angular/forms';
import { MailValidationComponent } from './component/users/mail-validation/mail-validation.component';
import { PaymentComponent } from './component/users/payment/payment.component';
import { PaymentSuccessComponent } from './component/users/payment-success/payment-success.component';
import { NotificationsComponent } from './component/users/notifications/notifications.component';
import { ClubguardService } from './guard/clubguard.service';
import { UserguardService } from './guard/userguard.service';
import { MeetingsComponent } from './component/users/meetings/meetings.component';
import { MeetComponent } from './component/users/meet/meet.component';


const routes: Routes = [
  {path:'',component: HomeComponent},
  {path:'login',component: LoginComponent},
  {path:'register',component: RegisterComponent},
  {path:'profile',component: ProfileComponent,canActivate:[UserguardService]},
  {path:'register/club',component: RegisterClubComponent},
  {path:'join/club',component: JoinClubComponent},
  {path:'club',component:ClubHomeComponent,canActivate:[ClubguardService]},
  {path:'club/clubProfile',component:ClubProfileComponent,canActivate:[ClubguardService]},
  {path:'club/finance',component:FinanceComponent,canActivate:[ClubguardService]},
  {path:'club/members',component:MembersComponent,canActivate:[ClubguardService]},
  {path:'club/profile',component:UserProfileComponent,canActivate:[ClubguardService]},
  {path:'club/settings',component:SettingsComponent,canActivate:[UserguardService]},
  {path:'user/:id/verify/:token',component:MailValidationComponent},
  {path:'club/payment',component:PaymentComponent,canActivate:[ClubguardService]},
  {path:'club/paymentSuccess/:id',component:PaymentSuccessComponent},
  {path:'club/notifications',component:NotificationsComponent,canActivate:[ClubguardService]},
  {path:'club/meeting',component:MeetingsComponent,canActivate:[ClubguardService]},
   {path:'club/meeting/:id',component:MeetComponent,canActivate:[ClubguardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
