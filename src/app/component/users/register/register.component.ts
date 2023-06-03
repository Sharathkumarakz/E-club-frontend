import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SocialAuthService, SocialUser, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { ToastrService } from 'ngx-toastr';
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
  
  constructor(private formBuilder: FormBuilder, private http: HttpClient,
    private router: Router,private authService: SocialAuthService,private ngZone: NgZone,
    private toastr:ToastrService) { }


    ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: '',
      email: '',
      password: ''
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
    if (user.name == "" || user.email == "" || user.password == "") {
      this.toastr.warning('All fields are needed','warning')

    } else if (!this.validateEmail(user.email)) {
      this.toastr.warning('Please enter a valid email','warning')

    } else {
      this.http.post('http://localhost:5000/gmail/register', user, {
        withCredentials: true
      }).subscribe(() => this.router.navigate(['/']), (err) => {
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
    let user = this.form.getRawValue()
    if (user.name == "" || user.email == "" || user.password == "") {
      this.toastr.warning('All fields are needed','warning')
    } else if (!this.validateEmail(user.email)) {
      this.toastr.warning('Please enter a valid email','warning')
    } else {
      this.http.post('http://localhost:5000/register', user, {
        withCredentials: true
      }).subscribe(() => this.router.navigate(['/']), (err) => {
        Swal.fire('Error', err.error.message, "error")
      })
    }
  }

}