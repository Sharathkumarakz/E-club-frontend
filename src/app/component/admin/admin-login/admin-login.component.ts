import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
 
  form: FormGroup

  constructor(private formBuilder: FormBuilder, private http: HttpClient,private toastr:ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: '',
      password: ''
    }),
      this.http.get('http://localhost:5000/admin/active', {
        withCredentials: true
      }).subscribe((response: any) => {
        console.log(response);
        this.router.navigate(['/admin/dashboard'])
        Emitters.authEmiter.emit(true)
      }, (err) => {
        this.router.navigate(['/admin']);
        Emitters.authEmiter.emit(false)
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
    let user = this.form.getRawValue()
    console.log(user);
    if (user.email == "" || user.password == "") {
     this.toastr.warning('All fields are required','Warning')
    } else if (!this.validateEmail(user.email)) {
      this.toastr.warning('please enter valid email','Warning')
    } else {
      this.http.post('http://localhost:5000/admin/login', user, {
        withCredentials: true
      }).subscribe(() => this.router.navigate(['/admin/dashboard']), (err) => {
        Swal.fire('Error', err.error.message, "error")
      })
    }
  }
}


