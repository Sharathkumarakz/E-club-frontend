
import { Component,OnInit,HostListener} from '@angular/core';
import { Emitters } from '../emitters/emitters';
import { Router,NavigationEnd } from '@angular/router';
import { Profile } from 'src/app/component/userState/models';
import { Store, select } from '@ngrx/store';
import { retrieveprofile } from 'src/app/component/userState/appAction';
import { userProfile } from 'src/app/component/userState/app.selectctor';
import { AuthService } from 'src/app/service/auth.service';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
  
  searchText: string;
  public message:any=""
  public authentication: boolean;
 public showNavBar: boolean=true;

 constructor( 
  private router: Router,
  private authService:AuthService,  
  private store: Store<{ userdetails: Profile }>,
  private _clubService:ClubServiveService,
  private _cookieService:CookieService
  ) { }

 //GETTING DATA FROM STORE
  sss$=this.store.pipe(select(userProfile)).subscribe(userProfileData => {
   this.message = userProfileData.name;
  })

  onSearch() {
      this._clubService.updateValue(this.searchText);
  }

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



  logout(): void {
  this.authService.logout().subscribe(() => {
      this.store.dispatch(retrieveprofile())
      this.message='' 
  this.authentication=false;
     this.router.navigate(['/']);

    });
  }
}
