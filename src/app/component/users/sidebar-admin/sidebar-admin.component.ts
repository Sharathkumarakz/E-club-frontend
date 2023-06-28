
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

  public message: any = ""
  public authentication: boolean;
  public param: any;
  public id: any;
  public name: any = '';

  sss$ = this.store.pipe(select(userProfile)).subscribe(userProfileData => {
    this.message = userProfileData.name;
  })

  constructor(
    private authService: AuthService,
    private clubService: ClubServiveService,
    private router: Router,
    private store: Store<{ userdetails: Profile }>
  ) { }

  ngOnInit() {
    this.authService.active().subscribe((response: any) => {
      this.store.dispatch(retrieveprofile())
      Emitters.authEmiter.emit(true)
    }, (err) => {
      this.store.dispatch(retrieveprofile())
      this.message = ""
      this.router.navigate(['/']);
      Emitters.authEmiter.emit(false)

    })

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
      this.message = ''
      this.authentication = false;
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



}
