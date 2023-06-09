import { Component, ViewChild } from '@angular/core';
import {Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})

export class NotificationsComponent {

  //material table
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<{ time: string; message: string }>([]);
  public param: string
  public leader: boolean = false
  public handler: any = null
  form: FormGroup
  public clubdetails: any
  public image = ''
  public button = 'Send Notification'
  public showNotification:boolean=false
  public loader:boolean=true;
  //displayed columns
  displayedColumn: string[] = ['time', 'message'];

  constructor(
    private formBuilder: FormBuilder,
    private clubService: ClubServiveService,
    private router: Router,
    public _toastr: ToastrService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      text: '',
    })
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      this.processData();
    }
  }

  //processing all functions
  processData() {
    if (this.param) {
      this.getDetails()
      this.getNotifications()
    }
  }

//getting club details
  getDetails() {
    this.clubService.getClubData(this.param)
      .subscribe((response: any) => {
        this.clubdetails = response.data;
        this.loader=false;
        if (response.data.president._id === response.user.id || response.data.secretory._id === response.user.id) {
          this.leader = true;
        }
        Emitters.authEmiter.emit(true);
      }, (err) => {
        this.router.navigate(['/']);
      })
  };

//send Notifications
  submit(): void {
    let user = this.form.getRawValue()
    if (/^\s*$/.test(user.text)) {
      this._toastr.warning('please enter Something', 'Warning')
    } else {
      this.button = 'Sending....'
      this.clubService.addNotification(this.param, user).subscribe((response) => {
        this.form = this.formBuilder.group({
          text: '',
        })
        this.getNotifications()
        this.button = 'Send Notification'
        this._toastr.success('Notification send successfully', 'suceess')
      }, (err) => {
        this._toastr.warning(err.error.message, 'Warning!')

      })
    }
  }

//get all notifications
  getNotifications() {
    this.clubService.getNotification(this.param).subscribe((response: any) => {
      this.dataSource.data = response;
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      Emitters.authEmiter.emit(true);
      if(response.length>0){
        this.showNotification=true;
      }
    }, (err) => {
      this.router.navigate(['/']);
    });
  }

  //table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

}

