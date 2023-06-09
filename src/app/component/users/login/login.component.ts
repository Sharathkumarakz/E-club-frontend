
import { Emitters } from '../emitters/emitters';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { CookieService } from 'ngx-cookie-service';
declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  form: FormGroup
  user: any
  public Submitted: boolean = false

  constructor(
    private _formBuilder: FormBuilder,
    private _authentication: AuthService,
    private _router: Router,
    private toastr: ToastrService,
    private ngZone: NgZone,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.form = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    }),

      //user authentication
      this._authentication.active().subscribe((response: any) => {
        this._router.navigate(['/'])
        Emitters.authEmiter.emit(true)
        ///----------------------------------------------------------------
        // const jsonResponse = JSON.stringify(response);
        // this.cookieService.set('jwt', jsonResponse)

        //------------------------------------------------
      }, (err) => {
        this._router.navigate(['/login'])
        Emitters.authEmiter.emit(false)
      })

    //google login
    this.renderGoogleSignInButton();
  }

  //vakidate mail
  validateEmail = (email: any) => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  renderGoogleSignInButton() {
    google.accounts.id.initialize({
      client_id: '1090651627816-das9jjg4hq7dtjlkvemjc3bnvhs984r4.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
    });
    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      {
        onClick: this.handleGoogleSignIn.bind(this),
      }
    );
  }

  handleCredentialResponse(response: any) {
    if (response.credential) {
      this.ngZone.run(() => {
        this.user = response.credential;
        const jwt = response.credential;

        const decodeJWT = (jwt: any) => {
          const payloadBase64 = jwt.split('.')[1];
          const payload = atob(payloadBase64);
          return JSON.parse(payload);
        };

        const jwtPayload = decodeJWT(jwt);
        let user = jwtPayload
        if (/^\s*$/.test(user.name) || /^\s*$/.test(user.email) || /^\s*$/.test(user.password)) {
          this.toastr.warning('All fields are needed', 'warning')
        } else if (!this.validateEmail(user.email)) {
          this.toastr.warning('Please enter a valid email', 'warning')
        } else {
          this._authentication.socialLogin(user).subscribe({
            next: (res: any) => {
              localStorage.setItem('userToken', res.token)
              this._router.navigate(['/'])
            },
            error: (err) => {
              this.toastr.warning(err.error.message, 'warning')
            }

          })
        }
      });
    }
  }

  handleGoogleSignIn() {
    google.accounts.id.prompt();
  }

  signOut() {
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke();
    this.user = null;
  }

  //login form submission
  submit(): void {
    this.Submitted = true;
    let user = this.form.getRawValue()
    if (this.form.invalid) {
      return
    }
    if (/^\s*$/.test(user.email) || /^\s*$/.test(user.password)) {
      this.toastr.warning('All fields are Required', 'warning')
    } else if (!this.validateEmail(user.email)) {
      this.toastr.warning('Enter a valid email.', 'warning')
    } else {
      this._authentication.login(user).subscribe((res: any) => {

        localStorage.setItem('userToken', res.token)
        this._router.navigate(['/'])
      }
        , (err) => {
          this.toastr.warning(err.error.message, 'warning')

        })
    }
  }

  //forgot password
  forgotPassword() {
    let user = this.form.getRawValue()
    if (/^\s*$/.test(user.email)) {
      this.toastr.warning('Enter your EmailId', 'warning')
    } else {
      this._authentication.changePassword(user).subscribe(() => this._router.navigate(['/']), (err) => {
        this.toastr.warning(err.error.message, 'warning')
      })
    }
  }
}


