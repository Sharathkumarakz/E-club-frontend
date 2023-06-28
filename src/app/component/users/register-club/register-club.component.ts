import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { ToastrService } from 'ngx-toastr';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register-club',
  templateUrl: './register-club.component.html',
  styleUrls: ['./register-club.component.css']
})
export class RegisterClubComponent implements OnInit {

  form: FormGroup
  public Submitted: boolean = false;
  public buttonMessage: string ="Create Club"
  constructor(
    private _formBuilder: FormBuilder,
    private _http: HttpClient,
    private _authService: AuthService,
    private _router: Router,
    private _toastr: ToastrService,
    private _clubService: ClubServiveService
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      clubName: ['', Validators.required],
      registerNo: ['', Validators.required],
      place: ['', Validators.required],
      category: ['', Validators.required],
      confirmCode: ['', Validators.required],
      secretory: ['', Validators.required],
      treasurer: ['', Validators.required],
      securityCode: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          ),
          Validators.minLength(8),
        ],
      ],
    })
  }

  validateEmail = (email: any) => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  submit(): void {
    this.Submitted = true;
    let user = this.form.getRawValue()
    if (this.form.invalid) {
      return
    }
    this._authService.active().subscribe((response: any) => {
      if (
        /^\s*$/.test(user.clubName) ||
        /^\s*$/.test(user.registerNo) ||
        /^\s*$/.test(user.place) ||
        /^\s*$/.test(user.category) ||
        /^\s*$/.test(user.confirmCode) ||
        /^\s*$/.test(user.securityCode) ||
        /^\s*$/.test(user.secretory) ||
        /^\s*$/.test(user.treasurer)
      ) {
        this._toastr.warning('All fields are needed', 'warning')

      }else if(!/[a-zA-Z]/.test(user.clubName)) {
        this._toastr.warning('Clubname should contain alphabets', 'warning')
      }
       else if(!/[a-zA-Z]/.test(user.place)) {
        this._toastr.warning('place should contain alphabets', 'warning')

      }else if (user.securityCode !== user.confirmCode) {
        this._toastr.warning('Security code not match', 'warning')

      } else if (!this.validateEmail(user.secretory) || !this.validateEmail(user.treasurer)) {
        this._toastr.warning('Please enter a valid email', 'warning')

      } else if (user.treasurer === user.secretory) {
        this._toastr.warning('Treasurer and Secrotory cannot be the same person', 'warning')
      } else {
        this.buttonMessage="Creating...."
        this._http.post('http://localhost:5000/register/club', user, {
          withCredentials: true
        }).subscribe(() => {
          this._clubService.joinClub(user).subscribe((response: any) => {
            if (response.authenticated) {
              this.buttonMessage="Create Club"
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
        }, (err) => {

          this._toastr.warning(err.error.message, 'Warning')

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