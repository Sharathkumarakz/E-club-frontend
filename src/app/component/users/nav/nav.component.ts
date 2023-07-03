
import { Component, OnInit, HostListener } from '@angular/core';
import { Emitters } from '../emitters/emitters';
import { Router, NavigationEnd } from '@angular/router';
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

  searchText: string;
  public message: string = ""
  public authentication: boolean;
  public showNavBar: boolean = true;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _store: Store<{ userdetails: Profile }>,
    private _clubService: ClubServiveService
  ) { }

  //getting data from store
  sss$ = this._store.pipe(select(userProfile)).subscribe(userProfileData => {
    this.message = userProfileData.name;
  })

  //search text sends to home page
  onSearch() {
    this._clubService.updateValue(this.searchText);
  }

  ngOnInit(): void {

    //user authentication
    this._authService.active().subscribe({
      next: () => {
        this._store.dispatch(retrieveprofile());
        Emitters.authEmiter.emit(true);
      },
      error: (err) => {
        this._store.dispatch(retrieveprofile());
        this.message = "";
        Emitters.authEmiter.emit(false);
      }
    });

    //checking url for navbar changes
    this.checkUrlForNavBar();

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkUrlForNavBar();
      }
    });
  }
 
  //checking url for navbar changes
  checkUrlForNavBar(): void {
    const url: string = this._router.url;
    if (url.includes('/profile') || url.includes('/club') || url.includes('/aboutUs')) {
      this.showNavBar = false;
    } else {
      this.showNavBar = true;
    }
  }

  //navbar scroll effect
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

  //user logout
  logout(): void {
    localStorage.removeItem('userToken')
    this._authService.logout().subscribe(() => {
      this._store.dispatch(retrieveprofile())
      this.message = ''
      this.authentication = false;
      this._router.navigate(['/']);
    });
  }
}
