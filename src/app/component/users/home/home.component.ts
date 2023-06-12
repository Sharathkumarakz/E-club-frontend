import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';
import { Profile } from 'src/app/component/userState/models';
import { Store, select } from '@ngrx/store';
import { retrieveprofile } from 'src/app/component/userState/appAction';
import { appUserService } from 'src/app/component/userState/appUser.Service';
import { userProfile } from 'src/app/component/userState/app.selectctor';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router,
    private store: Store<{ userdetails: Profile }>, private appService: appUserService,private toastr:ToastrService) { }

  public name: any = ""
  public email: any = ""
  public img: any = ""
  public loader:boolean = true
  sss$=this.store.pipe(select(userProfile)).subscribe(userProfileData => {

    if(userProfileData.isBlocked===true){
this.toastr.warning("You are blocked by E-club",'Warning');
    }else{
   // Extract the necessary values from the userProfileData object
   this. name = userProfileData.name;
    this.email = userProfileData.email;
    this.img = userProfileData.image;
    }
 
  })

ngOnInit(): void {
  this.store.dispatch(retrieveprofile())

  setTimeout(() => {
    this.loader=false;
  }, 1000);
}

registerClub(){
  this.router.navigate(['/register/club'])
}

joinClub(){
  this.router.navigate(['/join/club'])
}
}
