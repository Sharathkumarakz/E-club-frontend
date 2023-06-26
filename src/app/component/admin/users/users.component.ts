
import { Component, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { NgConfirmService } from 'ng-confirm-box';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {

  displayedColumn: string[] = ['index', 'image', 'name', 'email', 'phone', 'action', 'view'];

  //CLUB ID
  public id: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedImage: string = '';
  selectedText: string = '';
  selectedEmail: string = '';
  selectedPlace: string = '';
  selectedPhone: string;

  dataSource = new MatTableDataSource<{ image: string; name: string; email: string; phone: string; _id: any; registerNo: any }>([]);
  constructor(
    private _adminService: AdminServiceService,
    private _router: Router,
    private _toastr: ToastrService,
    private _confirmService: NgConfirmService
  ) { }

  ngOnInit() {
    this._adminService.active().subscribe((response: any) => {
      Emitters.authEmiter.emit(true)
    }, (err) => {
      this._router.navigate(['/admin']);
      Emitters.authEmiter.emit(false)
    })
    this.getUsersData()
  }

  getUsersData() {
    this._adminService.getUsers().subscribe((response: any) => {
      console.log(response);
      this.dataSource.data = response;
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    }, (err) => {
      this._router.navigate(['/admin']);
    })
  }

  selectItem(imageUrl: string, name: string, place: string, email: string, phone: string) {
    this.selectedImage = imageUrl;
    this.selectedText = name;
    this.selectedPlace = place;
    this.selectedEmail = email;
    this.selectedPhone = phone;
  }
  //TABLE FILTER
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  block(id: any) {
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
      confirmButtonText: 'Yes, block it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
           this._adminService.blockUser(id).subscribe((response: any) => {
        this.getUsersData()
        Emitters.authEmiter.emit(true)
      }, (err) => {
        this._router.navigate(['/admin']);
        Emitters.authEmiter.emit(false)
      })
        swalWithBootstrapButtons.fire(
          'Success!',
          'Blocked successfully.',
          'success'
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Success',
          'Blocking cancelled sucessfully :)',
          'success'
        )
      }
    })
  }

  unBlock(id: any) {
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
      confirmButtonText: 'Yes, unblock it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._adminService.unBlockUser(id).subscribe((response: any) => {
          this.getUsersData()
          this._toastr.success('Unblocked successfully', 'Success')
          Emitters.authEmiter.emit(true)
        }, (err) => {
          this._router.navigate(['/admin']);
          Emitters.authEmiter.emit(false)
        })
        swalWithBootstrapButtons.fire(
          'Success!',
          'unblocked successfully.',
          'success'
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Success',
          'Blocking cancelled sucessfully :)',
          'success'
        )
      }
    })
 
  }




}