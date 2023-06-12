
import { Emitters } from '../emitters/emitters';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validator, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SocialAuthService, SocialUser, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

declare const google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit  {
  form: FormGroup
  user:any
  public Submitted:boolean=false
  constructor(private formBuilder: FormBuilder,
    private authentication: AuthService,
    private router: Router,private toastr:ToastrService,private authService: SocialAuthService,private ngZone: NgZone) { }
  ngOnInit() {
    this.form = this.formBuilder.group({
      email:['',Validators.required],
      password: ['',Validators.required]
    }),
    this.authentication.active().subscribe((response:any)=>{
      this.router.navigate(['/'])
      Emitters.authEmiter.emit(true)
    },(err)=>{
      this.router.navigate(['/login'])
    Emitters.authEmiter.emit(false)
    })
    this.renderGoogleSignInButton();
  }


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
        theme: 'filled_black',
        size: 'large',
        text: 'Sign in with Google',
        onClick: this.handleGoogleSignIn.bind(this),
      }
    );
  }
  
  handleCredentialResponse(response: any) {
    if (response.credential) {
      this.ngZone.run(() => {
        this.user = response.credential;
     const jwt=response.credential;
        
  const decodeJWT = (jwt:any) => {
    const payloadBase64 = jwt.split('.')[1];
    const payload = atob(payloadBase64);
    return JSON.parse(payload);
  };
  
  const jwtPayload = decodeJWT(jwt);
  let user=jwtPayload
      if ( /^\s*$/.test(user.name)|| /^\s*$/.test(user.email)||/^\s*$/.test(user.password)) {
        this.toastr.warning('All fields are needed','warning')
  
      } else if (!this.validateEmail(user.email)) {
        this.toastr.warning('Please enter a valid email','warning')
  
      } else {
        this.authentication.socialLogin(user).subscribe(() => this.router.navigate(['/']), (err) => {
          Swal.fire('Error', err.error.message, "error")
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
  



  submit(): void {
    this.Submitted=true;
    let user = this.form.getRawValue()
    if(this.form.invalid){
      return
    }
    if (/^\s*$/.test(user.email)|| /^\s*$/.test(user.password)) {
      this.toastr.warning('All fields are Required','warning')

    } else if (!this.validateEmail(user.email)) {
      this.toastr.warning('Enter a valid email.','warning')

    } else {
     this.authentication.login(user).subscribe(() => this.router.navigate(['/']), (err) => {
        // Swal.fire(, 'Warning!');
        this.toastr.warning(err.error.message,'warning')
      })
    }
  }
}


