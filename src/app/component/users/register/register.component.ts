import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Emitters } from '../emitters/emitters';
import { AuthService } from 'src/app/service/auth.service';

declare const google: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  form: FormGroup
  user: any;
  loggedIn: boolean;
  public Submitted: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authentication: AuthService,
    private _router: Router,
    private _ngZone: NgZone,
    private _toastr: ToastrService
  ) { }


  ngOnInit(): void {
    //form and validators
    this.form = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          ),
          Validators.minLength(8),
        ],
      ],
      confirmPassword: ['', Validators.required],
    }),
    //user authentication
      this._authentication.active().subscribe((response: any) => {
        this._router.navigate(['/'])
        Emitters.authEmiter.emit(true)
      }, (err) => {
        Emitters.authEmiter.emit(false)
      })

      //google login
    this.renderGoogleSignInButton();
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
      this._ngZone.run(() => {
        this.user = response.credential;
        const jwt = response.credential;

        const decodeJWT = (jwt: any) => {
          const payloadBase64 = jwt.split('.')[1];
          const payload = atob(payloadBase64);
          return JSON.parse(payload);
        };

        const jwtPayload = decodeJWT(jwt);
        let user = jwtPayload

        if (/^\s*$/.test(user.name) || /^\s*$/.test(user.email) || /^\s*$/.test(user.password) || /^\s*$/.test(user.picture)) {
          this._toastr.warning('All fields are needed', 'warning')

        } else if (!this.validateEmail(user.email)) {
          this._toastr.warning('Please enter a valid email', 'warning')

        } else {
          this._authentication.socialLogin(user).subscribe(() => this._router.navigate(['/']), (err) => {
            this._toastr.warning(err.error.message, 'Warning!')
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

//mail validation
  validateEmail = (email: string) => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

//user register form submission
  submit(): void {
    this.Submitted = true;
    let user = this.form.getRawValue()
    if (this.form.invalid) {
      return
    }
    if (!/[a-zA-Z]/.test(user.name) || user.email == "" || /^\s*$/.test(user.password)) {
      this._toastr.warning('All fields are needed', 'warning')
    } else if (!this.validateEmail(user.email)) {
      this._toastr.warning('Please enter a valid email', 'warning')
    } else if (user.password !== user.confirmPassword) {
      this._toastr.warning('Password confirmation failed', 'warning')
    } else {
      this._authentication.userRegister(user).subscribe(() => this._toastr.success('Verify your Email', 'Success'), (err) => {
        this._toastr.warning( err.error.message, 'warning')
      })
    }
  }

}
