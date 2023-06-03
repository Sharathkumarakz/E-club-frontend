import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/users/home/home.component';
import { LoginComponent } from './component/users/login/login.component';
import { RegisterComponent } from './component/users/register/register.component';
import { ProfileComponent } from './component/users/profile/profile.component';
import { RegisterClubComponent } from './component/users/register-club/register-club.component';
import { JoinClubComponent } from './component/users/join-club/join-club.component';
import { ClubHomeComponent } from './component/users/club-home/club-home.component';
import { ClubAdminComponent } from './component/users/club-admin/club-admin.component';
import { ClubProfileComponent } from './component/users/club-profile/club-profile.component';
import { MembersClubProfileComponent } from './component/users/members-club-profile/members-club-profile.component';
import { ClubAdminMemberlistingComponent } from './component/users/club-admin-memberlisting/club-admin-memberlisting.component';
import { FinanceComponent } from './component/users/finance/finance.component';
import { TreasurerFinanceComponent } from './component/users/treasurer-finance/treasurer-finance.component';
import { MembersComponent } from './component/users/members/members.component';
import { userProfile } from './component/userState/app.selectctor';
import { UserProfileComponent } from './component/users/user-profile/user-profile.component';
import { SettingsComponent } from './component/users/settings/settings.component';

const routes: Routes = [
  {path:'',component: HomeComponent},
  {path:'login',component: LoginComponent},
  {path:'register',component: RegisterComponent},
  {path:'profile',component: ProfileComponent},
  {path:'register/club',component: RegisterClubComponent},
  {path:'join/club',component: JoinClubComponent},
  {path:'club',component:ClubHomeComponent},
  {path:'clubAdmin',component:ClubAdminComponent},
  {path:'club/clubProfile',component:ClubProfileComponent},
  {path:'club/memberClubProfile',component:MembersClubProfileComponent},
  {path:'club/admin/members',component:ClubAdminMemberlistingComponent},
  {path:'club/finance',component:FinanceComponent},
  {path:'club/treasurer',component:TreasurerFinanceComponent},
  {path:'club/members',component:MembersComponent},
  {path:'club/profile',component:UserProfileComponent},
  {path:'club/settings',component:SettingsComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
