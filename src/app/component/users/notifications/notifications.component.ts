import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared-service.service';
import { HttpClient } from '@angular/common/http';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {NgConfirmService} from 'ng-confirm-box'
import { AuthService } from 'src/app/service/auth.service';
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
  displayedColumn: string[] = ['time', 'message'];
  private readonly url=environment.apiUrl

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<{time:string; message: string }>([]);

  constructor(private formBuilder: FormBuilder,private authService:AuthService,private clubService:ClubServiveService,
    private router: Router,private _route: ActivatedRoute, private sharedService: SharedService, private http: HttpClient,public toastr:ToastrService,private confirmService:NgConfirmService) { }
  public param: any
public leader:boolean=false
 public handler:any=null
  // public id = this.sharedService.data$.subscribe(data => {
  //   this.param = data
  // });
  form: FormGroup
  events: any
  public clubdetails: any
  public image=''
  public button='Send Notification'
  ngOnInit() {
    this.form = this.formBuilder.group({
      text: '',
    })
    // this.id = this.sharedService.data$.subscribe((data: any) => {
    //   this.param = data;
    //   this.processData();
    // });

    // Retrieve saved data from local storage
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      this.processData();
    }

    // this._route.params.subscribe(params=>{
    //   this.param=params['clubId']
    //   this.processData();
    //     }) 
  }

  // ngOnDestroy() {
  //   this.id.unsubscribe(); // Unsubscribe to avoid memory leaks
  // }
 
  // isAuthenticated() {
  //   this.authService.authentication(this.param)
  //     .subscribe((response: any) => {
  //       if (response.authenticated) {
  //       } else {
  //         this.toastr.warning('You are not a part of this Club', 'warning')
  //         setTimeout(() => {
  //           this.router.navigate(['/'])
  //         }, 2000);
  //       }
  //       Emitters.authEmiter.emit(true);
  //     }, (err) => {
  //       this.router.navigate(['/']);
  //       Emitters.authEmiter.emit(false);
  //     });
  // }
  processData() {
    if (this.param) {
      // Save the data in local storage
      // this.isAuthenticated();
      // this.active()
      this.getDetails()
      this.getNotifications()
    }
  }

// active(){
//   this.http.get('http://localhost:5000/club/' + this.param, {
//     withCredentials: true
//   }).subscribe((response: any) => {
//    if(response.data.president._id===response.user.id ||response.data.president._id===response.user.id ){
//     this.leader=true;
//    }
//    console.log("resssssss",response);  
//     Emitters.authEmiter.emit(true);
//   }, (err) => {
//     this.router.navigate(['/']);
//   });
// }

getDetails() {
  this.clubService.getClubData(this.param)
      .subscribe((response: any) => {
        this.clubdetails = response.data;
        this.image = `${this.url}/public/user_images/`+ this.clubdetails.image
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
    this.toastr.warning('please enter Something','Warning')
  } else {
    this.button='Sending....'
  this.clubService.addNotification(this.param,user).subscribe((response) => {
      this.form = this.formBuilder.group({
        text: '',
      })
     this.getNotifications()
  this.button='Send Notification'
    this.toastr.success('Notification send successfully','suceess')      
    }, (err) => {
      Swal.fire('Error', err.error.message, "error")
    })
  }
}


getNotifications(){
this.clubService.getNotification(this.param).subscribe((response: any) => {
    this.dataSource.data = response;
    this.dataSource.paginator=this.paginator
    this.dataSource.sort=this.sort 
    Emitters.authEmiter.emit(true);
  }, (err) => {
    this.router.navigate(['/']);
  });
}


applyFilter(event: Event){
  const filterValue = (event.target as HTMLInputElement).value
  this.dataSource.filter= filterValue.trim().toLowerCase()
  if(this.dataSource.paginator){
    this.dataSource.paginator.firstPage()
  }
}

}

