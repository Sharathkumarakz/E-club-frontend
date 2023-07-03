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

  public name: string = ""
  public email: string = ""
  public img: string = ""
  public address: string = ''
  public about: string = ""
  public phone: string = ""
  selectedFile: any | File = null;
  form: FormGroup | any
  public clubs: any
  public clubName: ''
  public secretCode: ''
  public id: string = ''
  public google: boolean = false
  public loader: boolean = false

  //getting user details from state
  sss$ = this._store.pipe(select(userProfile)).subscribe(userProfileData => {
    this.name = userProfileData.name;
    this.email = userProfileData.email;
    this.img = userProfileData.image;
    this.address = userProfileData.address;
    this.about = userProfileData.about
    this.id = userProfileData._id;
    //patching data to form
    this.form?.patchValue({
      name:userProfileData.name,
      email: userProfileData.email,
      address: userProfileData.address,
      about:userProfileData.about,
      phone:userProfileData.phone
    });
  })


  ngOnInit(): void {
    //dispatching user from state
    this._store.dispatch(retrieveprofile())
    this.form = this._formBuilder.group({
      email:'',
      name: '',
      address:'',
      about:'',
      phone:'',
    })
    //user authentcation
    this._authService.active().subscribe(() => {
      this._store.dispatch(retrieveprofile())
      Emitters.authEmiter.emit(true)
    }, (err) => {
      this._router.navigate(['/']);
      Emitters.authEmiter.emit(false)
    })
    //getting all joined club of a user
    this.getclubData()
  }

  //user selected profile picture 
  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0]
  }

  //user profile picture updation
  profilePicureUpdate() {
    this.loader = true;
    if (!this.selectedFile) {
      this._toastr.warning('Select a image', 'Warning')
      this.loader = false;
      return
    }
    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
    this._authService.userProfilePicture(formData).subscribe({
      next: () => {
        this.loader = false;
        this._store.dispatch(retrieveprofile());
        Emitters.authEmiter.emit(true);
        this._toastr.success('Saved successfully', 'Success');
      },
      error: (err) => {
        this._toastr.warning(err.error.message, 'Warning!');
      }
    });
  }

  //updating user profile details
  updateProfileData(): void {
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
    this._authService.profileEdit(user).subscribe({
      next: () => {
      this._store.dispatch(retrieveprofile());
      this._toastr.success('Profile updated successfully', 'Success')
    },
    error: (err) => {
      this._toastr.warning(err.error.message, 'Warning!');
    }}
    );
  }
}

//joining to a club from profile
  joinClub(form: any): void {
    const formData = {
      club: form.value.clubId,
      // securityCode: form.value.securityCode
    };
    this._authService.profileJoinClub(formData).subscribe({
      next: (response: any) => {
      if (response.authenticated) {
      localStorage.setItem('myData', JSON.stringify(response.id));
      this._router.navigate(['/club']);
      } else if (response.changed) {
      this._toastr.warning('Password or Clubname has been changed by the club admins,Try Join with Credentials', 'warning');
      this._store.dispatch(retrieveprofile());
      } else {
      this._toastr.warning('You are not a part of this Club', 'warning');
      setTimeout(() => {
      this._router.navigate(['/']);
      }, 2000);
      this._router.navigate(['/']);
      }
      },
      error: (err) => {
      this._toastr.warning(err.error.message, 'warning');
      }
      });
  }

  getclubData() {
    this._clubService.getJoinedClubs().subscribe(
      (response) => {
        this.clubs = response
      })
  }
  
}



