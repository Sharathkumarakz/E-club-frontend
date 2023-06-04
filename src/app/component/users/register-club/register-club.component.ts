import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {HttpClient } from '@angular/common/http'
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register-club',
  templateUrl: './register-club.component.html',
  styleUrls: ['./register-club.component.css']
})
export class RegisterClubComponent implements OnInit {
  form: FormGroup

  constructor(private formBuilder: FormBuilder, private http: HttpClient,
    private router: Router,private toastr:ToastrService) { }

ngOnInit(): void {
  this.form = this.formBuilder.group({
    clubName: '',
    registerNo: '',
    place:'',
    category:'',
    president: '',
    secretory:'',
    treasurer:'',
    securityCode:''
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
  if (
    /^\s*$/.test(user.clubname) ||
    /^\s*$/.test(user.registerNo) ||
    /^\s*$/.test(user.place) ||
    /^\s*$/.test(user.category) ||
    /^\s*$/.test(user.president) ||
    /^\s*$/.test(user.secretory) ||
    /^\s*$/.test(user.treasurer)
  ) {
    this.toastr.warning('All fields are needed','warning')

  } else if (!this.validateEmail(user.president) || !this.validateEmail(user.secretory) || !this.validateEmail(user.treasurer)) {
    this.toastr.warning('Please enter a valid email','warning')

  } else {
    this.http.post('http://localhost:5000/register/club', user, {
      
      withCredentials: true
      
    }).subscribe(() => {
      this.toastr.success('Club created succesfuly','Success')

      setTimeout(() => {
        this.router.navigate(['/'])
      }, 2000);
     
    }, (err) => {
      
      this.toastr.warning(err.error.message,'Warning')

    })
  }
}
}
