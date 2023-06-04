import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { ToastrService } from 'ngx-toastr';
import { NgConfirmService } from 'ng-confirm-box';
@Component({
  selector: 'app-club-listing',
  templateUrl: './club-listing.component.html',
  styleUrls: ['./club-listing.component.css']
})


export class ClubListingComponent implements OnInit {
  public clubs:any
  constructor( private http: HttpClient,
    private router: Router,private toastr:ToastrService,private confirmService:NgConfirmService) { }
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

    this.http.get('http://localhost:5000/admin/club', {
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

addToBaklist(id:any){
this.confirmService.showConfirm("Are you sure to add blacklist",()=>{
  this.http.post('http://localhost:5000/admin/club/addToBlacklist/'+id, {
    withCredentials: true
  }).subscribe((response: any) => {
    this.toastr.success('Added to Blacklist','Success')
    Emitters.authEmiter.emit(true)
    this.clubs=response
  }, (err) => {
    this.router.navigate(['/admin']);
    Emitters.authEmiter.emit(false)
  })
},()=>{
  this.toastr.success('cancelled the process','Success')
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