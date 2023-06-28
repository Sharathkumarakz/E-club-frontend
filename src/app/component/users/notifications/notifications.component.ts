import { Component, ViewChild } from '@angular/core';
import {Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})

export class NotificationsComponent {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<{ time: string; message: string }>([]);
  public param: any
  public leader: boolean = false
  public handler: any = null
  form: FormGroup
  events: any
  public clubdetails: any
  public image = ''
  public button = 'Send Notification'
  //DISPLAYED COLUMNS
  displayedColumn: string[] = ['time', 'message'];
  private readonly url = environment.apiUrl
  public showNotification:boolean=false
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

  processData() {
    if (this.param) {
      this.getDetails()
      this.getNotifications()
    }
  }


  getDetails() {
    this.clubService.getClubData(this.param)
      .subscribe((response: any) => {
        this.clubdetails = response.data;
        this.image = `${this.url}/public/user_images/` + this.clubdetails.image
        if (response.data.president._id === response.user.id || response.data.president._id === response.user.id) {
          this.leader = true;
        }
        Emitters.authEmiter.emit(true);
      }, (err) => {
        this.router.navigate(['/']);
      })
  };


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


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

}

