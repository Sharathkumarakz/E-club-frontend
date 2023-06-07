import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { appUserService } from 'src/app/component/userState/appUser.Service';
import { Profile } from 'src/app/component/userState/models';
import { Store, select } from '@ngrx/store';
import { retrieveprofile } from 'src/app/component/userState/appAction';
import { userProfile } from 'src/app/component/userState/app.selectctor';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder, private appService: appUserService, private store: Store<{ userdetails: Profile }>, private toastr: ToastrService, private sharedService: SharedService,) { }
  public name: any = ""
  public email: any = ""
  public img: any = ""
  public address: any = ''
  public about: any = ""
  public phone: any = ""
  selectedFile: any | File = null;
  form: FormGroup | any
  public clubs: any
  public clubName: ''
  public secretCode: ''
  public id:any=''
  public google: boolean = false
  sss$ = this.store.pipe(select(userProfile)).subscribe(userProfileData => {
    this.name = userProfileData.name;
     this.email = userProfileData.email;
     this.img = userProfileData.image;
     this.address = userProfileData.address;
     this.phone = userProfileData.phone;
    this.about = userProfileData.about
    this.id=userProfileData._id;
    //  this.clubs = userProfileData.clubs
    this.log()
  })
  log(){
    console.log("select data",this.sss$ );
  }
  ngOnInit(): void {
    this.store.dispatch(retrieveprofile())
    this.form = this.formBuilder.group({
      email: this.email,
      name: this.name,
      address: this.address,
      about: this.about,
      phone: this.phone,
    })
      this.http.get('http://localhost:5000/user', {
        withCredentials: true
      }).subscribe((response: any) => {
        console.log(response, "yeaaaaaaaaaaaa");
        this.name = response.name
        this.email = response.email
        this.img = response.image
        this.store.dispatch(retrieveprofile())
        Emitters.authEmiter.emit(true)
      }, (err) => {
        this.router.navigate(['/']);
        Emitters.authEmiter.emit(false)
      })
      this.getclubData()
  }


  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0]
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
    console.log(formData);
    this.http.post('http://localhost:5000/profile-upload-single', formData, {
      withCredentials: true
    }).subscribe((response: any) => {
      this.store.dispatch(retrieveprofile())
      Emitters.authEmiter.emit(true)
      Emitters.authEmiter.emit(true)
      this.toastr.success('Saved successfully', 'Success')
    }, (err) => {
      Swal.fire('Error', err.error.message, "error")
    })
  }


  submit(): void {
    let user = this.form.getRawValue();
    console.log(user);
    this.http.post('http://localhost:5000/update/profile', user, {
      withCredentials: true
    }).subscribe(
      (response: any) => {
        this.store.dispatch(retrieveprofile());
        this.toastr.success('Profile updated successfully', 'warning')
        this.form = this.formBuilder.group({
          email: response.email,
          name: response.name,
          address: response.address,
          about: response.about,
          phone: response.phone,
        })
      },
      (err) => {
        Swal.fire(err.error.message, 'Warning!');
      }
    );
  }

   submitForm(form: any): void {
    console.log("hhererer");
    console.log(form);

    const formData = {
      clubName: form.value.clubName,
      securityCode: form.value.securityCode
    };

    this.http.post('http://localhost:5000/profile/join/club', formData, {
      withCredentials: true
    }).subscribe((response: any) => {
      if (response.authenticated) {
        console.log("it idddd", response.id);
        this.sharedService.setData(response.id);
        this.router.navigate(['/club']);
      } else if(response.changed) {
        this.toastr.warning('Password has been changed by the club admins,Try Join with Credentials', 'warning')
        this.store.dispatch(retrieveprofile());
      }else{
        this.toastr.warning('You are not a part of this Club', 'warning')

        setTimeout(() => {
          this.router.navigate(['/'])
        }, 2000);
        this.router.navigate(['/'])
      }
    }, (err) => {
    
      this.toastr.warning(err.error.message, 'warning')

    })
   }



   getclubData(){
    this.http.get('http://localhost:5000/user/clubs', {
      withCredentials: true
    }).subscribe(
      (response: any) => {
        this.clubs=response
        console.log("actual res",response);
        
      })
   }
  }



