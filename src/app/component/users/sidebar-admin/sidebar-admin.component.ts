
import { Component, OnInit, HostListener } from '@angular/core';
import { Emitters } from '../emitters/emitters';
import { Router } from '@angular/router';
import { Profile } from 'src/app/component/userState/models';
import { Store, select } from '@ngrx/store';
import { retrieveprofile } from 'src/app/component/userState/appAction';
import { userProfile } from 'src/app/component/userState/app.selectctor';
import { AuthService } from 'src/app/service/auth.service';
import { ClubServiveService } from 'src/app/service/club-servive.service';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css']
})

export class SidebarAdminComponent implements OnInit {

  public message: string = ""
  public authentication: boolean;
  public param: string;
  public id: string;
  public name$: string = '';

  //getting data from store
  sss$ = this._store.pipe(select(userProfile)).subscribe(userProfileData => {
    this.message = userProfileData.name;
  })

  constructor(
    private _authService: AuthService,
    private _clubService: ClubServiveService,
    private _router: Router,
    private _store: Store<{ userdetails: Profile }>
  ) { }

  ngOnInit() {
    //user authentication
    this._authService.active().subscribe((response: any) => {
      this._store.dispatch(retrieveprofile())
      Emitters.authEmiter.emit(true)
    }, (err) => {
      this._store.dispatch(retrieveprofile())
      this.message = ""
      this._router.navigate(['/']);
      Emitters.authEmiter.emit(false)

    })

    // Retrieve saved data from local storage
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      this.processData();
    }
  }

  //getting club details
  getDetails() {
    this._clubService.getClubData(this.param).subscribe((response: any) => {
      this.name$ = response.data.clubName;
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this._router.navigate(['/']);
    });
  }

  processData() {
    if (this.param) {
      this.getDetails();
    }
  }

  //user logout
  logout(): void {
    this._authService.logout().subscribe(() => {
      this._store.dispatch(retrieveprofile())
      this.message = ''
      this.authentication = false;
      this._router.navigate(['/']);
    });
  }

  //navbar effect
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



}
