
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})

export class MembersComponent {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private readonly url = environment.apiUrl
  form: FormGroup
  public param: string;
  public users: string;
  public leader: boolean = false
  public leaders: any
  selectedImage: string = '';
  selectedText: string = '';
  selectedEmail: string = '';
  selectedPlace: string = '';
  selectedPhone: string = '';
  public name: string = ''
  public image: string = '';
  public loader:boolean=true;
  //displayed columns
  displayedColumn: string[] = ['name', 'email', 'role', 'view', 'Action'];
  public id: any;
  dataSource = new MatTableDataSource<{ _id: any; image: string; name: string; role: string }>([]);

  constructor(
    private _formBuilder: FormBuilder,
    public _toastr: ToastrService,
    public authService: AuthService,
    public _clubService: ClubServiveService,
    private _router: Router
  ) { }

  searchText: string = ''
  ngOnInit() {
    this.form = this._formBuilder.group({
      member: ''
    });

    //getting clubId from local storage
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      this.processData();
    }

    //get all members of a club
    this.getMembers();

  }

  //selected items for users detail view
  selectItem(imageUrl: string, name: string, place: string, email: string, phone: string) {
    this.selectedImage = imageUrl;
    this.selectedText = name;
    this.selectedPlace = place;
    this.selectedEmail = email;
    this.selectedPhone = phone;
  }

  //validate email
  validateEmail = (email: any) => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

//add member
  submit(): void {
    let user = this.form.getRawValue()
    if (user.member == "") {
      this._toastr.warning('fields are required', 'Warning')
      return
    } else if (!this.validateEmail(user.member)) {
      this._toastr.warning('Please enter a valid Email!', 'Warning!')
      return
    } else {
      this._clubService.addMember(this.param, user).subscribe((response: any) => {
        this.getMembers()
        this._toastr.success('Added Successfully', 'Success')
        this.form = this._formBuilder.group({
          member: ''
        })
      }, (err) => {
        this.form = this._formBuilder.group({
          member: ''
        })
      this._toastr.warning(err.error.message, 'Warning!')
      })
    }
  }

  //process functions
  processData() {
    if (this.param) {
      this.getMembers();
      this.getDetails()
    }
  }

  //getting club data
  getDetails() {
    this._clubService.getClubData(this.param)
      .subscribe((response: any) => {
        this.leaders = response.data;
        this.loader=false;
        if (response.data.president._id === response.user.id || response.data.secretory._id === response.user.id) {
          this.leader = true;
        }
        Emitters.authEmiter.emit(true);
      }, (err) => {
        this._router.navigate(['/']);
      })
  };

  //getting all members
  getMembers() {
    this._clubService.getMembers(this.param)
      .subscribe(
        (response: any) => {
          this.dataSource.data = response.members;
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
        },
        (err) => {
          this._router.navigate(['/club/admin/members']);
          this._toastr.warning(err.error.message, 'Warning!')
        }
      );
  }

//table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  //delete member
  deleteMember(id: any) {

      let deleteData = {
        user: id,
        club: this.param
      }

  
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
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result:any) => {
      if (result.isConfirmed) {
        this._clubService.removeMember(deleteData).subscribe((response: any) => {
          this.getMembers()
        }, (err) => {
          this._toastr.warning( err.error.message, 'error');
          this._router.navigate(['/'])
        })
        swalWithBootstrapButtons.fire(
          'Success!',
          'Event Deleted Successfully',
          'success'
        )
      } else if (
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




