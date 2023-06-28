import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { ClubServiveService } from 'src/app/service/club-servive.service';

@Component({
  selector: 'app-join-club',
  templateUrl: './join-club.component.html',
  styleUrls: ['./join-club.component.css']
})

export class JoinClubComponent implements OnInit {

  form: FormGroup
  public Submitted: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    public _authentication: AuthService,
    public _clubService: ClubServiveService,
    private _router: Router,
    public _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      clubName: ['', Validators.required],
      securityCode: ['', Validators.required],
    })
  }

  //FORM SUBMISSION
  submit(): void {
    this.Submitted = true;
    let user = this.form.getRawValue()
    if (this.form.invalid) {
      return
    }
    this._authentication.active().subscribe((response: any) => {
      if (/^\s*$/.test(user.clubname) ||
        /^\s*$/.test(user.securityCode)) {
        this._toastr.warning('all fields are required', 'warning')
      } else {
        this._clubService.joinClub(user).subscribe((response: any) => {
          if (response.authenticated) {
            localStorage.setItem('myData', JSON.stringify(response.id));
            this._router.navigate(['/club'])
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
    },
      (err) => {
        this._toastr.warning('You need to login First', 'warning')
        setTimeout(() => {
          this._router.navigate(['/login'])
        }, 2000);
      })
  }
}
