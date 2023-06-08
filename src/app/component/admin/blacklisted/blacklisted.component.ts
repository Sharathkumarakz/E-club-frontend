import { HttpClient } from '@angular/common/http';
import { Component,ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { ToastrService } from 'ngx-toastr';
import { NgConfirmService } from 'ng-confirm-box';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-blacklisted',
  templateUrl: './blacklisted.component.html',
  styleUrls: ['./blacklisted.component.css']
})
export class BlacklistedComponent implements OnInit {
  public clubs:any
  displayedColumn: string[] = ['image','clubName', 'about', 'place','registerNo','action','view'];
  public id: any; // Subscription reference
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<{image:string ; place:string; clubName: string;  about: string; _id:any; registerNo:any  }>([]);

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
     this.dataSource.data = response;
     this.dataSource.paginator=this.paginator
     this.dataSource.sort=this.sort
    }, (err) => {
      this.router.navigate(['/admin']);
    })
}
applyFilter(event: Event){
  const filterValue = (event.target as HTMLInputElement).value
  this.dataSource.filter= filterValue.trim().toLowerCase()
  if(this.dataSource.paginator){
    this.dataSource.paginator.firstPage()
  }
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
    this.getClubsData()
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