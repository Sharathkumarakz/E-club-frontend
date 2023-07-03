
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { ToastrService } from 'ngx-toastr';
import { AdminServiceService } from 'src/app/service/admin-service.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})

export class AdminLoginComponent implements OnInit {
 
  form: FormGroup

  constructor(
    private _formBuilder: FormBuilder,
    private _toastr:ToastrService,
    private _adminService:AdminServiceService,
    private _router: Router
    ) { }

  ngOnInit() {
    this.form = this._formBuilder.group({
      email: '',
      password: ''
    }),
     this._adminService.active().subscribe((response: any) => {
        this._router.navigate(['/admin/dashboard'])
        Emitters.authEmiter.emit(true)
      }, (err) => {
        this._router.navigate(['/admin']);
        Emitters.authEmiter.emit(false)
      })
  }

//VALIDATION
  validateEmail = (email: any) => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
      return true;

    } else {
      return false;
    }
  }

//LOGIN SUBMISSION
  submit(): void {
    let user = this.form.getRawValue()
    if (user.email == "" || user.password == "") {
     this._toastr.warning('All fields are required','Warning')
    } else if (!this.validateEmail(user.email)) {
      this._toastr.warning('please enter valid email','Warning')
    } else {
   this._adminService.login(user).subscribe((response:any) => {
    localStorage.setItem('EClubAdmin',response.token)
    this._router.navigate(['/admin/dashboard'])
   }, (err) => {
        Swal.fire('Error', err.error.message, "error")
      })
    }
  }
}


