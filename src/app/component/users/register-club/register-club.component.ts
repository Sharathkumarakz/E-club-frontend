import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {HttpClient } from '@angular/common/http'
import Swal from 'sweetalert2';
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
  public Submitted:boolean = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient,private clubService:ClubServiveService,private authService:AuthService,
    private router: Router,private toastr:ToastrService) { }

ngOnInit(): void {
  this.form = this.formBuilder.group({
    clubName:['',Validators.required],
    registerNo:['',Validators.required],
    place:['',Validators.required],
    category:['',Validators.required],
    confirmCode:['',Validators.required],
    secretory:['',Validators.required],
    treasurer:['',Validators.required],
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
  this.Submitted=true;
    let user = this.form.getRawValue()
    if(this.form.invalid){
      return
    }
    console.log("gggggggggg");
    
   this.authService.active().subscribe((response: any) => {
  if (
    /^\s*$/.test(user.clubname) ||
    /^\s*$/.test(user.registerNo) ||
    /^\s*$/.test(user.place) ||
    /^\s*$/.test(user.category) ||
    /^\s*$/.test(user.confirmCode) ||
    /^\s*$/.test(user.securityCode) ||
    /^\s*$/.test(user.secretory) ||
    /^\s*$/.test(user.treasurer)
  ) {
    this.toastr.warning('All fields are needed','warning')

  } else if (user.securityCode!==user.confirmCode){
    this.toastr.warning('Security code not match','warning')

  }else if (!this.validateEmail(user.secretory) || !this.validateEmail(user.treasurer)) {
    this.toastr.warning('Please enter a valid email','warning')

  } else if(user.treasurer===user.secretory){
    this.toastr.warning('Treasurer and Secrotory cannot be the same person','warning')
  }else{
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
},
(err) => {
 this.toastr.warning('You need to login First','warning')
 setTimeout(() => {
   this.router.navigate(['/login'])
 }, 2000);
})
}
}