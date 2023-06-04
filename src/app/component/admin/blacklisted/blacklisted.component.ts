import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { ToastrService } from 'ngx-toastr';
import { NgConfirmService } from 'ng-confirm-box';
@Component({
  selector: 'app-blacklisted',
  templateUrl: './blacklisted.component.html',
  styleUrls: ['./blacklisted.component.css']
})
export class BlacklistedComponent implements OnInit {
  public clubs:any
  constructor( private http: HttpClient,
    private router: Router,private toastr:ToastrService,private confirService:NgConfirmService) { }
  ngOnInit() {
  this.http.get('http://localhost:5000/admin/active', {
    withCredentials: true
  }).subscribe((response: any) => {
    Emitters.authEmiter.emit(true)
  }, (err) => {
    this.router.navigate(['/admin']);
    Emitters.authEmiter.emit(false)
  })
  this.getClubsData()
}




getClubsData(){

    this.http.get('http://localhost:5000/admin/club/blacklisted', {
      withCredentials: true
    }).subscribe((response: any) => {
     console.log(response);
     this.clubs=response
    }, (err) => {
      this.router.navigate(['/admin']);
    })
}

viewData(id:any){
  console.log(id);
  this.router.navigate(['/admin/club/',id]);
}

removeFromBlackList(id:any){
this.confirService.showConfirm("Are you sure to remove from here",
()=>{
  this.http.post('http://localhost:5000/admin/club/removeBlacklist/'+id, {
    withCredentials: true
  }).subscribe((response: any) => {
    this.clubs=response
    this.toastr.success('Removed from Blacklist','Success')
    Emitters.authEmiter.emit(true)
  }, (err) => {
    this.router.navigate(['/admin']);
    Emitters.authEmiter.emit(false)
  })
},()=>{
  this.toastr.success('Cancelled ','Success')
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