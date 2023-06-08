import { HttpClient } from '@angular/common/http';
import { Component ,ViewChild} from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { ToastrService } from 'ngx-toastr';
import { NgConfirmService } from 'ng-confirm-box';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-club-listing',
  templateUrl: './club-listing.component.html',
  styleUrls: ['./club-listing.component.css']
})


export class ClubListingComponent implements OnInit {
  public clubs:any
  displayedColumn: string[] = ['image','clubName', 'about', 'place','register no','action','view'];
  public id: any; // Subscription 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<{image:string ; place:string; clubName: string;  about: string; _id:any; registerNo:any  }>([]);

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

addToBaklist(id:any){
this.confirmService.showConfirm("Are you sure to add blacklist",()=>{
  this.http.post('http://localhost:5000/admin/club/addToBlacklist/'+id, {
    withCredentials: true
  }).subscribe((response: any) => {
    this.toastr.success('Added to Blacklist','Success')
    Emitters.authEmiter.emit(true)
    this.getClubsData()
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