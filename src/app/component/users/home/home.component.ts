import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from 'src/app/component/userState/models';
import { Store, select } from '@ngrx/store';
import { retrieveprofile } from 'src/app/component/userState/appAction';
import { userProfile } from 'src/app/component/userState/app.selectctor';
import { ToastrService } from 'ngx-toastr';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { environment } from 'src/environments/environment';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  constructor(
    private _router: Router,
    private _clubService: ClubServiveService,
    private _store: Store<{ userdetails: Profile }>,
    private _toastr: ToastrService,
    private _adminService: AdminServiceService,
    private _cookieService:CookieService   
  ) { }


  public api: string = environment.apiUrl
  public name: string = ""
  public email: string = ""
  public img: string = ""
  public loader: boolean = true
  public searchText: string = ""
  public searchData: any;
  public bannerData:any

//accessing usr stste
  sss$ = this._store.pipe(select(userProfile)).subscribe(userProfileData => {
    if (userProfileData.isBlocked === true) {
      this._toastr.warning("You are blocked by E-club", 'Warning');
       } else {
      this.name = userProfileData.name;
      this.email = userProfileData.email;
      this.img = userProfileData.image;
       }
     })

  ngOnInit(): void {
let data=this._cookieService.get('jwt')
    console.log(data,"this is cookie");
    
  this._store.dispatch(retrieveprofile())   
    setTimeout(() => {
      //LOADER ANIMATION
      this.loader = false;
    }, 1000);

//getting banner
this.getBanner()

//searching clubs
    this._clubService.value$.subscribe(value => {
      this._clubService.getAllClubs(value).subscribe((response: any) => {
        if(response.length==0) {
          this.searchData = ""
          this.searchText = ""
        }else{
          this.searchData = response
        }
      }, (err: any) => {
        this.searchData = ""
        this.searchText = ""
      })
      this.searchText = value
    });
  }

  //get all banners
  getBanner(){
    this._adminService.getBanner().subscribe((response)=>{
      this.bannerData=response
    })
  }

//navigation to club-rgistration page
  registerClub() {
    this._router.navigate(['/register/club'])
  }

// navigation to join club page
  joinClub() {
    this._router.navigate(['/join/club'])
  }

  //search club view
  getClub(id: string) {
    this._router.navigate(['/clubProfile', id])
  }

}
