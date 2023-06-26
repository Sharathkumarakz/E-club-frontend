import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/shared-service.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
private readonly url = environment.apiUrl
  
  constructor( private router: Router,private clubService:ClubServiveService,private authService:AuthService, private formBuilder: FormBuilder,public sharedService:SharedService,private toastr:ToastrService,private _route:ActivatedRoute) { }
  public clubName:any=''
  public regiterNo:any=''
  public place:any=''
  public category:any=''
  public about:any=''
  public presidentNew:any=''
  public secretoryNew:any=''
  public treasurerNew:any=''
  public securityOld:any=''
  public securityNew:any=''
  public securityConfirm:any=''
  form: FormGroup | any
  public param:any
  public image:string=''
  public id = this.sharedService.data$.subscribe(data => {
    console.log("hmmmmm",data);
    this.param=data // Handle received data
  });
 

   ngOnInit(): void {

     this.authService.active().subscribe((response: any) => {
     console.log(response,"yeaaaaaaaaaaaa");
        Emitters.authEmiter.emit(true)
      }, (err) => {
        this.router.navigate(['/']);
        Emitters.authEmiter.emit(false)
      })
      this._route.params.subscribe(params=>{
        this.param=params['clubId']
        this.processData();
          }) 
  
  
      // Retrieve saved data from local storage
      const storedData = localStorage.getItem('myData');
      if (storedData) {
        this.param = JSON.parse(storedData);
            this.processData();
      }
      this.form = this.formBuilder.group({
         clubName:'',
        regiterNo: "",
        place:"",
        category:"",
        about:"",
        presidentNew:"",
        secretoryNew:"",
        treasurerNew:"",
        securityOld:"",
        securityNew:"",
        securityConfirm:""
          })

    }
  
    ngOnDestroy() {
      this.id.unsubscribe(); // Unsubscribe to avoid memory leaks
    }
  
  
    // isAuthenticated() {
    //   this.authService.authentication(this.param)
    //     .subscribe((response: any) => {
    //       if (response.authenticated) {
    //         this.active()
    //       } else {
    //         this.toastr.warning('You are not a part of this Club', 'warning')
    //         setTimeout(() => {
    //           this.router.navigate(['/'])
    //         }, 2000);
    //       }
    //       Emitters.authEmiter.emit(true);
    //     }, (err) => {
    //       this.router.navigate(['/']);
    //       Emitters.authEmiter.emit(false);
    //     });
    // }
submitClubData(): void {
  let club = this.form.getRawValue();

this.clubService.editClubProfile(this.param,club).subscribe(
    (response:any) => {
      this.clubName=response.clubName
      this.about = response.about
      this.place = response.address
      this.regiterNo=response.registerNo
      this.category = response.category
      this.form.controls['clubName'].setValue(this.clubName);
      this.form.controls['place'].setValue(this.place);
      this.form.controls['regiterNo'].setValue(this.regiterNo);
      this.form.controls['category'].setValue(this.category);
      this.form.controls['about'].setValue(this.about);
       this.toastr.success('Profile updated successfully','Success')
    },
    (err) => {
      Swal.fire(err.error.message, 'Warning!');
    }
  );
}

updateSecurityCode(){
  let security = this.form.getRawValue();
  if(/^\s*$/.test(security.securityNew)||/^\s*$/.test(security.securityConfirm)||/^\s*$/.test(security.securityOld)){
    this.toastr.warning('All fields are needed','warning')
  }else if(security.securityNew !==security.securityConfirm){
  this.toastr.warning('Success code validation failed','warning')
}else{
  console.log("hmmm");
 this.clubService.securityUpdate(this.param,security).subscribe((response: any) => {
    this.form = this.formBuilder.group({
     securityOld:"",
     securityNew:"",
     securityConfirm:""
       })
       this.toastr.success('Secret code updated successfully','Success')

  }, (err) => {
    Swal.fire(err.error.message, 'Warning!');
  })
}

}

getClubDetails() {
this.clubService.getClubData(this.param).subscribe((response: any) => {
   this.clubName=response.data.clubName
   this.about = response.data.about
   this.place = response.data.address
   this.regiterNo=response.data.registerNo
   this.category = response.data.category
   this.image=`${this.url}/public/user_images/`+response.data.image
   this.form.controls['clubName'].setValue(this.clubName);
   this.form.controls['place'].setValue(this.place);
   this.form.controls['regiterNo'].setValue(this.regiterNo);
   this.form.controls['category'].setValue(this.category);
   this.form.controls['about'].setValue(this.about);
    Emitters.authEmiter.emit(true);
  }, (err) => {
    this.router.navigate(['/']);
  });
}



validateEmail = (email: any) => {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (email.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}


updateCommitee(): void {
  let commitee = this.form.getRawValue()
  if (commitee.presidentNew == "" || commitee.secretoryNew == "" || commitee.treasurerNew == "") {
    this.toastr.warning('All fields are needed','warning')

  } else if (!this.validateEmail(commitee.presidentNew) || !this.validateEmail(commitee.secretoryNew)||!this.validateEmail(commitee.treasurerNew)) {
    this.toastr.warning('Please enter a valid email','warning')

  } else {
   this.clubService.changeCommitee(this.param,commitee).subscribe(() => {
      // this.isAuthenticated()
      this.active()
      this.toastr.success('Successfully updated','Success')

    }, (err) => {
      Swal.fire('Error', err.error.message, "error")
    })
  }
}
active(){
 this.clubService.getClubData(this.param).subscribe((response: any) => {
   if(response.data.president._id===response.user.id ||response.data.secretory._id===response.user.id ){
    
   }else{
    this.router.navigate(['/club']);
   }
   console.log("resssssss",response);  
    Emitters.authEmiter.emit(true);
  }, (err) => {
    this.router.navigate(['/']);
  });
}
processData(){
  if (this.param) {
    localStorage.setItem('myData', JSON.stringify(this.param));
this.getClubDetails() 
// this.isAuthenticated()
  }
}
}

