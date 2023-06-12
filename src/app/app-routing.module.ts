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


const routes: Routes = [
  {path:'',component: HomeComponent},
  {path:'login',component: LoginComponent},
  {path:'register',component: RegisterComponent},
  {path:'profile',component: ProfileComponent},
  {path:'register/club',component: RegisterClubComponent},
  {path:'join/club',component: JoinClubComponent},
  {path:'club',component:ClubHomeComponent},
  {path:'club/clubProfile',component:ClubProfileComponent},
  {path:'club/finance',component:FinanceComponent},
  {path:'club/members',component:MembersComponent},
  {path:'club/profile',component:UserProfileComponent},
  {path:'club/settings',component:SettingsComponent},
  {path:'user/:id/verify/:token',component:MailValidationComponent},
  {path:'club/payment',component:PaymentComponent},
  {path:'club/paymentSuccess/:id',component:PaymentSuccessComponent},
  {path:'club/notifications',component:NotificationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
