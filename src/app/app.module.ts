import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//------------------------------ngrx modules------------------------------------

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { profileReducer } from './component/userState/appReducer';
import { appEffects } from './component/userState/app.Effect';
import { appUserService } from './component/userState/appUser.Service';

//------------------------------materials----------------------------------------

import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';


//------------------------------service--------------------------------------------

import { ClubguardService } from './guard/clubguard.service';
import { UserguardService } from './guard/userguard.service';
import { ChatService } from './service/chat.service';

//------------------------------components-----------------------------------------

import { AppComponent } from './app.component';
import { HomeComponent } from './component/users/home/home.component';
import { LoginComponent } from './component/users/login/login.component';
import { RegisterComponent } from './component/users/register/register.component';
import { ClubHomeComponent } from './component/users/club-home/club-home.component';
import { NavComponent } from './component/users/nav/nav.component';
import { ProfileComponent } from './component/users/profile/profile.component';
import { RegisterClubComponent } from './component/users/register-club/register-club.component';
import { JoinClubComponent } from './component/users/join-club/join-club.component';
import { ClubProfileComponent } from './component/users/club-profile/club-profile.component';
import { SidebarAdminComponent } from './component/users/sidebar-admin/sidebar-admin.component';
import { FinanceComponent } from './component/users/finance/finance.component';
import { MembersComponent } from './component/users/members/members.component';
import { UserProfileComponent } from './component/users/user-profile/user-profile.component';
import { SettingsComponent } from './component/users/settings/settings.component';
import { AdminLoginComponent } from './component/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './component/admin/admin-dashboard/admin-dashboard.component';
import { AdminRoutingModule } from './component/admin/admin-login/admin.route.module';
import { NavbarComponent } from './component/admin/navbar/navbar.component';
import { ClubListingComponent } from './component/admin/club-listing/club-listing.component';
import { UsersComponent } from './component/admin/users/users.component';
import { BannerComponent } from './component/admin/banner/banner.component';
import { BlacklistedComponent } from './component/admin/blacklisted/blacklisted.component';
import { ClubDetailviewComponent } from './component/admin/club-detailview/club-detailview.component';
import { MailValidationComponent } from './component/users/mail-validation/mail-validation.component';
import { PaymentComponent } from './component/users/payment/payment.component';
import { PaymentSuccessComponent } from './component/users/payment-success/payment-success.component';
import { NotificationsComponent } from './component/users/notifications/notifications.component';
import { MeetingsComponent } from './component/users/meetings/meetings.component';
import { EntertinementComponent } from './component/users/entertinement/entertinement.component';
import { ChangepasswordComponent } from './component/users/changepassword/changepassword.component';
import { ClubViewComponent } from './component/users/club-view/club-view.component';
import { AboutUsComponent } from './component/users/about-us/about-us.component';
import { ErrorPageComponent } from './component/users/error-page/error-page.component'

//----------------------------------auth modules----------------------------------------------------

import { SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

const config: SocketIoConfig = {
  url: environment.apiUrl, // socket server url;
  options: {
    transports: ['websocket']
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ClubHomeComponent,
    NavComponent,
    ProfileComponent,
    RegisterClubComponent,
    JoinClubComponent,
    ClubProfileComponent,
    SidebarAdminComponent,
    FinanceComponent,
    MembersComponent,
    UserProfileComponent,
    SettingsComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    NavbarComponent,
    ClubListingComponent,
    UsersComponent,
    BannerComponent,
    BlacklistedComponent,
    ClubDetailviewComponent,
    MailValidationComponent,
    PaymentComponent,
    PaymentSuccessComponent,
    NotificationsComponent,
    MeetingsComponent,
    EntertinementComponent,
    ChangepasswordComponent,
    ClubViewComponent,
    AboutUsComponent,
    ErrorPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot({ userdetails: profileReducer }),
    EffectsModule.forRoot([appEffects]),
    SocialLoginModule,
    ToastrModule.forRoot(),
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AdminRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,

    SocketIoModule.forRoot(config),
  ],
  providers: [
    appUserService, DatePipe, ClubguardService, UserguardService, ChatService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('1090651627816-das9jjg4hq7dtjlkvemjc3bnvhs984r4.apps.googleusercontent.com'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
