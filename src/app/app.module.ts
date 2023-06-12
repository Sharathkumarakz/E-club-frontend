import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/users/home/home.component';
import { LoginComponent } from './component/users/login/login.component';
import { RegisterComponent } from './component/users/register/register.component';
import { ClubHomeComponent } from './component/users/club-home/club-home.component';
import { NavComponent } from './component/users/nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { profileReducer } from './component/userState/appReducer';
import { appEffects } from './component/userState/app.Effect';
import { appUserService } from './component/userState/appUser.Service';
import { SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { ProfileComponent } from './component/users/profile/profile.component';
import { ToastrModule } from 'ngx-toastr';
import { RegisterClubComponent } from './component/users/register-club/register-club.component';
import { JoinClubComponent } from './component/users/join-club/join-club.component';
import { ClubProfileComponent } from './component/users/club-profile/club-profile.component';
import { SidebarAdminComponent } from './component/users/sidebar-admin/sidebar-admin.component';
import { FinanceComponent } from './component/users/finance/finance.component';
import { MembersComponent } from './component/users/members/members.component';
import { UserProfileComponent } from './component/users/user-profile/user-profile.component';
import { SettingsComponent } from './component/users/settings/settings.component';
import { CommonModule, DatePipe } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AdminLoginComponent } from './component/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './component/admin/admin-dashboard/admin-dashboard.component';
import { AdminRoutingModule } from './component/admin/admin-login/admin.route.module';
import { NavbarComponent } from './component/admin/navbar/navbar.component';
import { SidebarComponent } from './component/admin/sidebar/sidebar.component';
import { ClubListingComponent } from './component/admin/club-listing/club-listing.component';
import { UsersComponent } from './component/admin/users/users.component';
import { BannerComponent } from './component/admin/banner/banner.component';
import { BlacklistedComponent } from './component/admin/blacklisted/blacklisted.component';
import { ClubDetailviewComponent } from './component/admin/club-detailview/club-detailview.component';
 import {NgConfirmModule} from 'ng-confirm-box';
import { MailValidationComponent } from './component/users/mail-validation/mail-validation.component';
import { MatTableModule } from '@angular/material/table'
import {MatPaginatorModule } from '@angular/material/paginator'
import {MatSortModule } from '@angular/material/sort'
import {MatFormFieldModule } from '@angular/material/form-field'
import {MatInputModule } from '@angular/material/input';
import { PaymentComponent } from './component/users/payment/payment.component';
import { PaymentSuccessComponent } from './component/users/payment-success/payment-success.component';
import { NotificationsComponent } from './component/users/notifications/notifications.component';

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
    SidebarComponent,
    ClubListingComponent,
    UsersComponent,
    BannerComponent,
    BlacklistedComponent,
    ClubDetailviewComponent,
    MailValidationComponent,
    PaymentComponent,
    PaymentSuccessComponent,
    NotificationsComponent,
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
    NgConfirmModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    appUserService, DatePipe,
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
export class AppModule {}
