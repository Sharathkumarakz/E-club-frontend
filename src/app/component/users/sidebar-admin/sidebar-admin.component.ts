import { HttpClient } from '@angular/common/http';
import { Component,OnInit,HostListener } from '@angular/core';
import { Emitters } from '../emitters/emitters';
import { ActivatedRoute, Router } from '@angular/router';
import { appUserService } from 'src/app/component/userState/appUser.Service';
import { Profile } from 'src/app/component/userState/models';
import { Store, select } from '@ngrx/store';
import { retrieveprofile } from 'src/app/component/userState/appAction';
import { userProfile } from 'src/app/component/userState/app.selectctor';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared-service.service';
import { AuthService } from 'src/app/service/auth.service';
import { ClubServiveService } from 'src/app/service/club-servive.service';


@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css']
})
export class SidebarAdminComponent implements OnInit {
  public message:any=""
  public authentication: boolean;
  public param: any;
  // form: FormGroup;
  public id: any; 
  public name: any = '';



  sss$=this.store.pipe(select(userProfile)).subscribe(userProfileData => {
    // Extract the necessary values from the userProfileData object
   this.message = userProfileData.name;
  })
  constructor(private http: HttpClient,private authService:AuthService,private clubService:ClubServiveService, private router: Router, private appService: appUserService, private store: Store<{ userdetails: Profile }>,
    private sharedService: SharedService,private _route:ActivatedRoute) { }

ngOnInit() {
  this.authService.active().subscribe((response:any)=>{
   this.store.dispatch(retrieveprofile())
     // this.message=response.name;
     Emitters.authEmiter.emit(true)
    }, (err) => {
     this.store.dispatch(retrieveprofile())
     this.message=""
     this.router.navigate(['/']);
     Emitters.authEmiter.emit(false)
    
   })
  // this.id = this.sharedService.data$.subscribe((data: any) => {
  //   this.param = data;
  //   this.processData();
  // });
  // this._route.params.subscribe(params=>{
  //   this.param=params['clubId']
  //   this.processData()
  //     })

  // Retrieve saved data from local storage
  const storedData = localStorage.getItem('myData');
  if (storedData) {
    this.param = JSON.parse(storedData);
    this.processData();
  }
}






getDetails() {
this.clubService.getClubData(this.param).subscribe((response: any) => {
    this.name = response.data.clubName;
    Emitters.authEmiter.emit(true);
  }, (err) => {
    this.router.navigate(['/']);
  });
}
  

processData() {
  if (this.param) {
    // Save the data in local storage
    // localStorage.setItem('myData', JSON.stringify(this.param));

    this.getDetails();
  }
}
  
logout(): void {
this.authService.logout().subscribe(() => {
    this.store.dispatch(retrieveprofile())
    this.message='' 
    this.authentication=false;
    this.router.navigate(['/']);
  });
}

isScrolledDown = false;
prevScrollPos = window.pageYOffset || document.documentElement.scrollTop;

@HostListener('window:scroll', [])
onWindowScroll() {
  const currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScrollPos > this.prevScrollPos) {
    this.isScrolledDown = true;
  } else {
    this.isScrolledDown = false;
  }

  this.prevScrollPos = currentScrollPos;
}



goToProfile(){
  console.log("haaaaaaaaaa");
  
  this.router.navigate(['/club/clubProfile',this.param]);
}


goToMembers(){
  this.router.navigate(['/club/members',this.param]);  
}

goTomeeting(){
  console.log(this.param,"ttttttttttttttttttttttttttttttttttttttttttttt");
  
  this.router.navigate(['/club/meeting',this.param]);  
}

goToNotifications(){
  this.router.navigate(['/club/notifications',this.param]);  

}
goToFinance(){
  this.router.navigate(['/club/finance',this.param]);  

}

goToClub(){
  this.router.navigate(['/club',this.param]);  
 
}
gotoProfile(){
  this.router.navigate(['']);  
 
}
gotoNews(){
  this.router.navigate(['/club/news',this.param]);  
}
}
