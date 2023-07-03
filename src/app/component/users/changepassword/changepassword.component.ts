import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})

export class ChangepasswordComponent implements OnInit {

  public newPassword: string = ''
  public confirmPassword: string = ''
  public token: string = ''
  public id: string = ''

  constructor(
    private _authentication: AuthService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {

    //getting token from route
    this._route.params.subscribe(params => {
      this.token = params['token'];
    });
    
     //getting id from route
    this._route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  //change password form submission
  validateSubmitForm() {
    if (/^\s*$/.test(this.confirmPassword) || /^\s*$/.test(this.newPassword)) {
      this._toastr.warning('All fields are required', 'Warning')
    } else if (this.newPassword !== this.confirmPassword) {
      this._toastr.warning('password confirmation failed', 'warning')
    } else {
      let data = {
        password: this.newPassword,
        userId: this.id,
        tokenId: this.token
      }
      this._authentication.login(data).subscribe(
      {
        next:(res:any)=>{ 
          localStorage.setItem('userToken',res.token)
          this._router.navigate(['/'])
        },
        error:(err)=>{
          this._toastr.warning(err.error.message, 'warning')
        }
      })
    }
  }

}

