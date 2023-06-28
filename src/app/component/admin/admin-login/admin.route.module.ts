import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { ClubListingComponent } from '../club-listing/club-listing.component';
import { BlacklistedComponent } from '../blacklisted/blacklisted.component';
import { UsersComponent } from '../users/users.component';
import { ClubDetailviewComponent } from '../club-detailview/club-detailview.component';
import { BannerComponent } from '../banner/banner.component';
import { ErrorPageComponent } from '../../users/error-page/error-page.component';

const routes: Routes = [
{path: 'admin', component:AdminLoginComponent},
{path:'admin',
children:[
    {path:'dashboard',component:AdminDashboardComponent},
    {path:'clubs',component:ClubListingComponent},
    {path:'blacklist',component:BlacklistedComponent},
    {path:'banners',component:BannerComponent},
    {path:'users',component:UsersComponent},
    {path:'club/:id',component:ClubDetailviewComponent},
]},
{path:'**',component:ErrorPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
