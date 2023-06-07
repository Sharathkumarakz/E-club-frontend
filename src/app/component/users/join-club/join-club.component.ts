import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {HttpClient } from '@angular/common/http'
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/shared-service.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-join-club',
  templateUrl: './join-club.component.html',
  styleUrls: ['./join-club.component.css']
})

export class JoinClubComponent implements OnInit{
  form: FormGroup
  public Submitted:boolean=false;
  constructor(private formBuilder: FormBuilder, private http: HttpClient,private sharedService: SharedService,
    private router: Router,public toastr:ToastrService) { }

ngOnInit(): void {
  this.form = this.formBuilder.group({
    clubName:['',Validators.required],
    securityCode:['',Validators.required],
    category:['',Validators.required],
  })   
}

submit(): void {
  this.Submitted=true;
  let user = this.form.getRawValue()
  if(this.form.invalid){
    return
  }
  this.http.get('http://localhost:5000/user', {
    withCredentials: true
  }).subscribe((response: any) => {
  if ( /^\s*$/.test(user.clubname) ||
  /^\s*$/.test(user.securityCode) ||
  /^\s*$/.test(user.category)) {
    this.toastr.warning('all fields are required','warning')

  } else {
    this.http.post('http://localhost:5000/join/club', user, {
      
      withCredentials: true
      
    }).subscribe((response: any) => {
  
      console.log("rrrrrrrrrrrrreeeeeeeeeeeee",response);
      
    if(response.authenticated){
      this.sharedService.setData(response.id);
      this.router.navigate(['/club'])
    }else{
      this.toastr.warning('You are not a part of this Club','warning')
      setTimeout(() => {
        this.router.navigate(['/'])
      }, 2000);
      this.router.navigate(['/'])
    }
 
    }, (err) => {
      this.toastr.warning(err.error.message,'warning')
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
