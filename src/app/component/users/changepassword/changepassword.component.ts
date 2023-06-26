import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
public newPassword:any=''
public confirmPassword:any=''
public token:string=''
public id:string=''
constructor( private _authentication:AuthService,  private _router: Router,private _route:ActivatedRoute,private _toastr:ToastrService){}
ngOnInit() {
  this._route.params.subscribe(params => {
    this.token = params['token'];
  });
  this._route.params.subscribe(params => {
    this.id = params['id'];
  });
}
validateSignupForm(){
  if (/^\s*$/.test(this.confirmPassword) || /^\s*$/.test(this.newPassword)){
    this._toastr.warning('All fields are required','Warning')
  }else if(this.newPassword!==this.confirmPassword){
   this._toastr.warning('password confirmation failed','warning')
  }else{
    let data={
      password:this.newPassword,
      userId:this.id,
      tokenId:this.token
    }
    this._authentication.login(data).subscribe(() => this._router.navigate(['/']), (err) => {
      this._toastr.warning(err.error.message,'warning')
    })
  }
  }
}

