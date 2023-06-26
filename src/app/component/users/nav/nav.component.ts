import { HttpClient } from '@angular/common/http';
import { Component,OnInit,EventEmitter,Output} from '@angular/core';
import { Emitters } from '../emitters/emitters';
import { Router,NavigationEnd } from '@angular/router';
import { appUserService } from 'src/app/component/userState/appUser.Service';
import { Profile } from 'src/app/component/userState/models';
import { Store, select } from '@ngrx/store';
import { retrieveprofile } from 'src/app/component/userState/appAction';
import { userProfile } from 'src/app/component/userState/app.selectctor';
import { AuthService } from 'src/app/service/auth.service';
import { ClubServiveService } from 'src/app/service/club-servive.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  // @Output() searchTextChange = new EventEmitter<string>();
  searchText: string;
  public message:any=""
  public authentication: boolean;
 public showNavBar: boolean=true;
  sss$=this.store.pipe(select(userProfile)).subscribe(userProfileData => {
    // Extract the necessary values from the userProfileData object
   this.message = userProfileData.name;
  })
  onSearch() {
      this._clubService.updateValue(this.searchText);
  }
  constructor(private http: HttpClient, private router: Router,private authService:AuthService, private appService: appUserService, private store: Store<{ userdetails: Profile }>,private _clubService:ClubServiveService) { }
  ngOnInit(): void {
    this.authService.active().subscribe(
      (response: any) => {
        this.store.dispatch(retrieveprofile());
        Emitters.authEmiter.emit(true);
      },
      (err) => {
        this.store.dispatch(retrieveprofile());
        this.message = "";
      
        Emitters.authEmiter.emit(false);
      }
    );
  
    this.checkUrlForNavBar();
  
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkUrlForNavBar();
      }
    });
  }
  
  checkUrlForNavBar(): void {
    const url: string = this.router.url;
    if (url.includes('/profile') ||url.includes('/club') ||url.includes('/aboutUs') ) {
      this.showNavBar = false;
    } else {
      this.showNavBar = true;
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
}
