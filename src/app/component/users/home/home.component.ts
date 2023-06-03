import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Profile } from 'src/app/component/userState/models';
import { Store, select } from '@ngrx/store';
import { retrieveprofile } from 'src/app/component/userState/appAction';
import { appUserService } from 'src/app/component/userState/appUser.Service';
import { userProfile } from 'src/app/component/userState/app.selectctor';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router,
    private store: Store<{ userdetails: Profile }>, private appService: appUserService) { }

    
  public name: any = ""
  public email: any = ""
  public img: any = ""
  sss$=this.store.pipe(select(userProfile)).subscribe(userProfileData => {
    // Extract the necessary values from the userProfileData object
   this. name = userProfileData.name;
    this.email = userProfileData.email;
    this.img = userProfileData.image;
  })

ngOnInit(): void {
  this.store.dispatch(retrieveprofile())
}

registerClub(){
  this.router.navigate(['/register/club'])
}

joinClub(){
  this.router.navigate(['/join/club'])
}
}
