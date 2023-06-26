
import { Component ,ViewChild} from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { ToastrService } from 'ngx-toastr';
import { NgConfirmService } from 'ng-confirm-box';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-club-listing',
  templateUrl: './club-listing.component.html',
  styleUrls: ['./club-listing.component.css']
})


export class ClubListingComponent implements OnInit {

//TABLE COLUMNS
  displayedColumn: string[] = ['index','image','clubName', 'about', 'place','register no','action','view'];

//CLUB ID
  public id: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<{image:string ; place:string; clubName: string;  about: string; _id:any; registerNo:any  }>([]);

  constructor(
    private _adminService:AdminServiceService,
    private _router: Router,
    private _toastr:ToastrService,
    private _confirmService:NgConfirmService
    ) { }

  ngOnInit() {
  this._adminService.active().subscribe((response: any) => {
    Emitters.authEmiter.emit(true)
  }, (err) => {
    this._router.navigate(['/admin']);
    Emitters.authEmiter.emit(false)
  })
  this.getClubsData()
}

//GETTING ALL CLUBS
getClubsData(){
    this._adminService.getClubs().subscribe((response: any) => {
     console.log(response);
     this.dataSource.data = response;
          this.dataSource.paginator=this.paginator
          this.dataSource.sort=this.sort
    }, (err) => {
      this._router.navigate(['/admin']);
    })
}

//TABLE FILTER
applyFilter(event: Event){
  const filterValue = (event.target as HTMLInputElement).value
  this.dataSource.filter= filterValue.trim().toLowerCase()
  if(this.dataSource.paginator){
    this.dataSource.paginator.firstPage()
  }
}

//NAVIGATION TO CLUB DETAIL VIEW
viewData(id:any){
  console.log(id);
  this._router.navigate(['/admin/club/',id]);
}

addToBaklist(id:any){
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  
  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, add to blacklist!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      this._adminService.addToBlacklisted(id).subscribe((response: any) => {
        this._toastr.success('Added to Blacklist','Success')
        Emitters.authEmiter.emit(true)
        this.getClubsData()
      }, (err) => {
        this._router.navigate(['/admin']);
        Emitters.authEmiter.emit(false)
      })
      swalWithBootstrapButtons.fire(
        'Success!',
        'Added to Blacklist',
        'success'
      )
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Cancelled',
        'Process cancelled! :)',
        'error'
      )
    }
  })
}
}