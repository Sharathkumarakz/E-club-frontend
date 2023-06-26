
import { Component, ViewChild } from '@angular/core';
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
  selector: 'app-blacklisted',
  templateUrl: './blacklisted.component.html',
  styleUrls: ['./blacklisted.component.css']
})

export class BlacklistedComponent implements OnInit {

  //TABLE COLUMNS
  displayedColumn: string[] = ['index', 'image', 'clubName', 'about', 'place', 'registerNo', 'action', 'view'];

  public id: string;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<{ image: string; place: string; clubName: string; about: string; _id: any; registerNo: any }>([]);

  constructor(
    private _adminService: AdminServiceService,
    private _router: Router,
    private _toastr: ToastrService,
    private _confirService: NgConfirmService
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

  //GETTING BLACKLISTED CLUBS
  getClubsData() {
    this._adminService.getBlacklisted().subscribe((response: any) => {
      this.dataSource.data = response;
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    }, (err) => {
      this._router.navigate(['/admin']);
    })
  }

  //TABLE FILTERING
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  //NAVIGATION TO CLUB DETAIL VIEW
  viewData(id: any) {
    console.log(id);
    this._router.navigate(['/admin/club/', id]);
  }


  removeFromBlackList(id: any) {
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
        confirmButtonText: 'Yes, remove from here!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this._adminService.removeBlacklisted(id).subscribe((response: any) => {
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