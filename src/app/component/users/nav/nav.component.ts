import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { Emitters } from '../emitters/emitters';
import { Router } from '@angular/router';
import { appUserService } from 'src/app/component/userState/appUser.Service';
import { Profile } from 'src/app/component/userState/models';
import { Store, select } from '@ngrx/store';
import { retrieveprofile } from 'src/app/component/userState/appAction';
import { userProfile } from 'src/app/component/userState/app.selectctor';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public message:any=""
  public authentication: boolean;

  sss$=this.store.pipe(select(userProfile)).subscribe(userProfileData => {
    // Extract the necessary values from the userProfileData object
   this.message = userProfileData.name;
  })
  constructor(private http: HttpClient, private router: Router, private appService: appUserService, private store: Store<{ userdetails: Profile }>) { }
  ngOnInit():void{
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
   
  })

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
