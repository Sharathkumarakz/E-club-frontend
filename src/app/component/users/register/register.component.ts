import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SocialAuthService, SocialUser, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { Emitters } from '../emitters/emitters';
import { AuthService } from 'src/app/service/auth.service';
import { ClubServiveService } from 'src/app/service/club-servive.service';
declare const google: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup
  user:any;
loggedIn:boolean;
  public Submitted:boolean = false;
  constructor(private formBuilder: FormBuilder, private http: HttpClient,private clubService: ClubServiveService,private authentication:AuthService,
    private router: Router,private authService: SocialAuthService,private ngZone: NgZone,
    private toastr:ToastrService) { }


    ngOnInit(): void {
    this.form = this.formBuilder.group({
      name:['',Validators.required],
      email:['',Validators.required],
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
      confirmPassword:['',Validators.required],
    }),
this.authentication.active().subscribe((response:any)=>{
      this.router.navigate(['/'])
      Emitters.authEmiter.emit(true)
    },(err)=>{
      // this.router.navigate(['/register'])
    Emitters.authEmiter.emit(false)
    })
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
      // theme: 'filled_black',
      // size: 'large',
      // text: 'Sign in with Google',
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
console.log(user);

    if ( /^\s*$/.test(user.name)|| /^\s*$/.test(user.email)||/^\s*$/.test(user.password)||/^\s*$/.test(user.picture)) {
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


  validateEmail = (email: any) => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }


  submit(): void {
    this.Submitted=true;
    let user = this.form.getRawValue()
    if(this.form.invalid){
      return
    }
    if (user.name == "" || user.email == "" || user.password == "") {
      this.toastr.warning('All fields are needed','warning')
    } else if (!this.validateEmail(user.email)) {
      this.toastr.warning('Please enter a valid email','warning')
    }else if(user.password!==user.confirmPassword){
      this.toastr.warning('Password confirmation failed','warning')
    }else {
     this.authentication.userRegister(user).subscribe(() =>this.toastr.success('Verify ur Emal','Success') , (err) => {
        Swal.fire('Error', err.error.message, "error")
      })
    // }).subscribe(() => this.router.navigate(['/']), (err) => {
    //   Swal.fire('Error', err.error.message, "error")
    // })
    }
  }

}
