import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Emitters } from 'src/app/component/users/emitters/emitters';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public users:any
  constructor( private http: HttpClient,
    private router: Router,private toastr:ToastrService) { }
  ngOnInit() {
  this.http.get('http://localhost:5000/admin/active', {
    withCredentials: true
  }).subscribe((response: any) => {
    Emitters.authEmiter.emit(true)
  }, (err) => {
    this.router.navigate(['/admin']);
    Emitters.authEmiter.emit(false)
  })
  this.getUsersData()
}




getUsersData(){

    this.http.get('http://localhost:5000/admin/users', {
      withCredentials: true
    }).subscribe((response: any) => {
     console.log(response);
     this.users=response
    }, (err) => {
      this.router.navigate(['/admin']);
    })
}

// viewData(id:any){
//   console.log(id);
//   this.router.navigate(['/admin/club/',id]);
// }

block(id:any){
  console.log(id,"Pppppppppppppp");
  this.http.post('http://localhost:5000/admin/user/block/'+id,{
    withCredentials: true
  }).subscribe((response: any) => {
    this.users=response
    this.toastr.success('Blocked successfully','Success')
    Emitters.authEmiter.emit(true)
  }, (err) => {
    this.router.navigate(['/admin']);
    Emitters.authEmiter.emit(false)
  })
}

unBlock(id:any){
  this.http.post('http://localhost:5000/admin/user/unBlock/'+id, {
    withCredentials: true
  }).subscribe((response: any) => {
    this.users =response
    this.toastr.success('Unblocked successfully','Success')
    Emitters.authEmiter.emit(true)
  }, (err) => {
    this.router.navigate(['/admin']);
    Emitters.authEmiter.emit(false)
  })
}


logout(): void {
  this.http.post('http://localhost:5000/admin/logout', {}, {
    withCredentials: true
  }).subscribe(() => {
   this.router.navigate(['/admin']);
  });
}

}