import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(private formBuilder: FormBuilder, private http: HttpClient,private sharedService: SharedService,
    private router: Router,public toastr:ToastrService) { }

ngOnInit(): void {
  this.form = this.formBuilder.group({
    clubName: '',
    securityCode:'',
  })   
}

submit(): void {
  let user = this.form.getRawValue()
  console.log(user);
  this.http.get('http://localhost:5000/user', {
    withCredentials: true
  }).subscribe((response: any) => {
  if (user.clubname == "" || user.securityCode== "") {
    this.toastr.warning('all fields are required','warning')

  } else {
    this.http.post('http://localhost:5000/join/club', user, {
      
      withCredentials: true
      
    }).subscribe((response: any) => {
  
      console.log("rrrrrrrrrrrrreeeeeeeeeeeee",response);
      
    if(response.president){
      console.log("it idddd",response.id);
      this.sharedService.setData(response.id);
      this.router.navigate(['/clubAdmin']);  
      console.log("aaaaauth",response);
    }else if(response.secretory){
      this.sharedService.setData(response.id);
      this.router.navigate(['/clubAdmin'])
    }else if(response.treasurer){
      this.sharedService.setData(response.id);
      this.router.navigate(['/club'])
    }else if(response.member){
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
      Swal.fire(err.error.message, 'Warning!');
    })
  }
},
 (err) => {
  this.toastr.warning('You need to login First','warning')

  setTimeout(() => {
    this.router.navigate(['/'])
  }, 2000);
})
}
}
