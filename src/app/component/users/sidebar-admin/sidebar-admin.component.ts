import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { Emitters } from '../emitters/emitters';
import { ActivatedRoute, Router } from '@angular/router';
import { appUserService } from 'src/app/component/userState/appUser.Service';
import { Profile } from 'src/app/component/userState/models';
import { Store, select } from '@ngrx/store';
import { retrieveprofile } from 'src/app/component/userState/appAction';
import { userProfile } from 'src/app/component/userState/app.selectctor';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared-service.service';
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
  constructor(private http: HttpClient, private router: Router, private appService: appUserService, private store: Store<{ userdetails: Profile }>,
    private sharedService: SharedService) { }

ngOnInit() {
  this.http.get('http://localhost:5000/user',{
    withCredentials:true
  }).subscribe((response:any)=>{
   this.store.dispatch(retrieveprofile())
     // this.message=response.name;
     Emitters.authEmiter.emit(true)
    }, (err) => {
     this.store.dispatch(retrieveprofile())
     this.message=""
     this.router.navigate(['/']);
     Emitters.authEmiter.emit(false)
    
   }), 
  this.id = this.sharedService.data$.subscribe((data: any) => {
    this.param = data;
    this.processData();
  });


  // Retrieve saved data from local storage
  const storedData = localStorage.getItem('myData');
  if (storedData) {
    this.param = JSON.parse(storedData);
    this.processData();
  }
}

ngOnDestroy() {
  this.id.unsubscribe(); // Unsubscribe to avoid memory leaks
}




getDetails() {
  this.http.get('http://localhost:5000/club/' + this.param, {
    withCredentials: true
  }).subscribe((response: any) => {
    this.name = response.clubName;
    Emitters.authEmiter.emit(true);
  }, (err) => {
    this.router.navigate(['/']);
  });
}
  

processData() {
  if (this.param) {
    // Save the data in local storage
    localStorage.setItem('myData', JSON.stringify(this.param));

    this.getDetails();
  }
}
  
logout(): void {
  this.http.post('http://localhost:5000/logout', {}, {
    withCredentials: true
  }).subscribe(() => {
    this.store.dispatch(retrieveprofile())
    this.message='' 
this.authentication=false;
   this.router.navigate(['/']);

  });
}

}
