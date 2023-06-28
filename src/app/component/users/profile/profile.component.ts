import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Profile } from 'src/app/component/userState/models';
import { Store, select } from '@ngrx/store';
import { retrieveprofile } from 'src/app/component/userState/appAction';
import { userProfile } from 'src/app/component/userState/app.selectctor';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { ClubServiveService } from 'src/app/service/club-servive.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _clubService: ClubServiveService,
    private _formBuilder: FormBuilder,
    private _store: Store<{ userdetails: Profile }>,
    private _toastr: ToastrService,
  ) { }

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
  public id: any = ''
  public google: boolean = false
  public loader: boolean = false

  sss$ = this._store.pipe(select(userProfile)).subscribe(userProfileData => {
    this.name = userProfileData.name;
    this.email = userProfileData.email;
    this.img = userProfileData.image;
    this.address = userProfileData.address;

    this.about = userProfileData.about
    this.id = userProfileData._id;
    this.form.patchValue({
      name:userProfileData.name,
      email: userProfileData.email,
      address: userProfileData.address,
      about:userProfileData.about,
      phone:userProfileData.phone
    });
  })


  ngOnInit(): void {
    this._store.dispatch(retrieveprofile())
    this.form = this._formBuilder.group({
      email:'',
      name: '',
      address:'',
      about:'',
      phone:'',
    })
    this._authService.active().subscribe((response: any) => {
      this._store.dispatch(retrieveprofile())
      Emitters.authEmiter.emit(true)
    }, (err) => {
      this._router.navigate(['/']);
      Emitters.authEmiter.emit(false)
    })
    this.getclubData()
  }

  // patchFormValues() {
  //   this.form.patchValue({
  //     name: this.name,
  //     email: this.email,
  //     address: this.address,
  //     about: this.about,
  //     phone: this.phone
  //   });
  // }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0]
  }
  onSubmit() {
    this.loader = true;
    if (!this.selectedFile) {
      this._toastr.warning('Select a image', 'Warning')
      this.loader = false;
      return
    }
    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);

    this._authService.userProfilePicture(formData).subscribe((response: any) => {
      this.loader = false
      this._store.dispatch(retrieveprofile())
      Emitters.authEmiter.emit(true)
      Emitters.authEmiter.emit(true)
      this._toastr.success('Saved successfully', 'Success')
    }, (err) => {
      this._toastr.success( err.error.message, 'Success')
    })
  }


  submit(): void {
    let user = this.form.getRawValue();
    var phoneNumber = user.phone; 
    var phoneRegex = /^[0-9]{10}$/;
    if(/^\s*$/.test(user.name)||/^\s*$/.test(user.phone)||/^\s*$/.test(user.about)||/^\s*$/.test(user.address)){
      this._toastr.info('all Fields are Mandatory', 'Warnng')
    }else if(!/[a-zA-Z]/.test(user.name)){
      this._toastr.info('Name should contain alphabets', 'Warnng')    
    }else if(!/[a-zA-Z]/.test(user.about)){
      this._toastr.info('About should contain alphabets', 'Warnng')
    }else if(!/[a-zA-Z]/.test(user.address)){
      this._toastr.info('About should contain alphabets', 'Warnng')
    }  else if (!phoneRegex.test(phoneNumber)) {
      this._toastr.info('Enter a valid phone number', 'Warnng')

    } else {
 
    this._authService.profileEdit(user).subscribe((response) => {
      this._store.dispatch(retrieveprofile());
      this._toastr.success('Profile updated successfully', 'Success')
    },
      (err) => {
        this._toastr.warning(err.error.message, 'Warning!')
      }
    );
  }
}

  submitForm(form: any): void {
    const formData = {
      clubName: form.value.clubName,
      securityCode: form.value.securityCode
    };

    this._authService.profileJoinClub(formData).subscribe((response: any) => {
      if (response.authenticated) {
        localStorage.setItem('myData', JSON.stringify(response.id));
        this._router.navigate(['/club']);
      } else if (response.changed) {
        this._toastr.warning('Password has been changed by the club admins,Try Join with Credentials', 'warning')
        this._store.dispatch(retrieveprofile());
      } else {
        this._toastr.warning('You are not a part of this Club', 'warning')
        setTimeout(() => {
          this._router.navigate(['/'])
        }, 2000);
        this._router.navigate(['/'])
      }
    }, (err) => {
      this._toastr.warning(err.error.message, 'warning')
    })
  }

  getclubData() {
    this._clubService.getJoinedClubs().subscribe(
      (response) => {
        this.clubs = response
      })
  }
}



