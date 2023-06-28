import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { SharedService } from 'src/app/shared-service.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  private readonly url = environment.apiUrl

  constructor(
    private _router: Router,
    private _clubService: ClubServiveService,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    public _sharedService: SharedService,
    private _toastr: ToastrService,
  ) { }

  public clubName: string = ''
  public regiterNo: string = ''
  public place: string = ''
  public category: string = ''
  public about: string = ''
  public presidentNew: string = ''
  public secretoryNew: string = ''
  public treasurerNew: string = ''
  public securityOld: string = ''
  public securityNew: string = ''
  public securityConfirm: string = ''
  form: FormGroup
  public param: string
  public image: string = ''



  ngOnInit(): void {

    this._authService.active().subscribe((response) => {
      Emitters.authEmiter.emit(true)
    }, (err) => {
      this._router.navigate(['/']);
      Emitters.authEmiter.emit(false)
    })

    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      this.processData();
    }

    this.form = this._formBuilder.group({
      clubName: "",
      regiterNo: "",
      place: "",
      category: "",
      about: "",
      presidentNew: "",
      secretoryNew: "",
      treasurerNew: "",
      securityOld: "",
      securityNew: "",
      securityConfirm: ""
    })
  }

  submitClubData(): void {
    let club = this.form.getRawValue();
    if(/^\s*$/.test(club.clubName)|| /^\s*$/.test(club.about) || /^\s*$/.test(club.place) || /^\s*$/.test(club.register)||/^\s*$/.test(club.category)){
      this._toastr.warning('All fields are mandatory', 'Warning')
   return
  }else if(!/[a-zA-Z]/.test(club.clubName)){
    this._toastr.info('ClubName should contain alphabets', 'Warnng')    
  }else if(!/[a-zA-Z]/.test(club.about)){
    this._toastr.info('About should contain alphabets', 'Warnng')
  }else if(!/[a-zA-Z]/.test(club.place)){
    this._toastr.info('Location should contain alphabets', 'Warnng')
  }  else{
    this._clubService.editClubProfile(this.param, club).subscribe(
      (response: any) => {
        // this.clubName = response.clubName
        // this.about = response.about
        // this.place = response.address
        // this.regiterNo = response.registerNo
        // this.category = response.category
        this.form.patchValue({
          clubName : response.clubName,
           about : response.about,
          place : response.address,
          regiterNo: response.registerNo,
          category : response.category
        });
        this._toastr.success('Profile updated successfully', 'Success')
      },
      (err) => {
        this._toastr.warning(err.error.message, 'Warning!')
      }
    );
  }
}

  updateSecurityCode() {
    let security = this.form.getRawValue();
    if (/^\s*$/.test(security.securityNew) || /^\s*$/.test(security.securityConfirm) || /^\s*$/.test(security.securityOld)) {
      this._toastr.warning('All fields are needed', 'warning')
    } else if (security.securityNew !== security.securityConfirm) {
      this._toastr.warning('Success code validation failed', 'warning')
    } else {
      this._clubService.securityUpdate(this.param, security).subscribe((response: any) => {
        this.form = this._formBuilder.group({
          securityOld: "",
          securityNew: "",
          securityConfirm: ""
        })
        this._toastr.success('Secret code updated successfully', 'Success')
      }, (err) => {
        this._toastr.warning(err.error.message, 'Warning!')
      })
    }
  }

  getClubDetails() {
    this._clubService.getClubData(this.param).subscribe((response: any) => {
      this.form.patchValue({
        clubName : response.data.clubName,
         about : response.data.about,
        place : response.data.address,
        regiterNo: response.data.registerNo,
        category : response.data.category
      });
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this._router.navigate(['/']);
    });
  }

  validateEmail = (email: string) => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  updateCommitee(): void {
    let commitee = this.form.getRawValue()
    console.log(commitee);
    if (commitee.presidentNew == "" || commitee.secretoryNew == "" || commitee.treasurerNew == "") {
      this._toastr.warning('All fields are needed', 'warning')
    return
    } else if (!this.validateEmail(commitee.presidentNew) || !this.validateEmail(commitee.secretoryNew) || !this.validateEmail(commitee.treasurerNew)) {
      this._toastr.warning('Please enter a valid email', 'warning')
      return
    } else if(
      commitee.presidentNew===commitee.secretoryNew ||
       commitee.presidentNew===commitee.treasurerNew ||
         commitee.secretoryNew===commitee.treasurerNew ){
      this._toastr.warning('Same person cant do Two roles', 'warning')
   return
    } else {
      this._clubService.changeCommitee(this.param, commitee).subscribe(() => {
        this.active()
        this._toastr.success('Successfully updated', 'Success')

      }, (err) => {
        this._toastr.warning(err.error.message, 'Warning!')
      })
    }
  }

  active() {
    this._clubService.getClubData(this.param).subscribe((response: any) => {
      if (response.data.president._id === response.user.id || response.data.secretory._id === response.user.id) {

      } else {
        this._router.navigate(['/club']);
      }
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this._router.navigate(['/']);
    });
  }
  processData() {
    if (this.param) {
      this.getClubDetails()
    }
  }

}

