import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared-service.service';
import { HttpClient } from '@angular/common/http';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgConfirmService } from 'ng-confirm-box'
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-club-home',
  templateUrl: './club-home.component.html',
  styleUrls: ['./club-home.component.css']
})

export class ClubHomeComponent {
  private readonly url = environment.apiUrl
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private http: HttpClient,
    public toastr: ToastrService,
    private confirmService: NgConfirmService,
    private clubService: ClubServiveService,
    private authService: AuthService) { }
  public param: any
  public leader: boolean = false
  public handler: any = null
  public id = this.sharedService.data$.subscribe(data => {
    this.param = data
  });
  form: FormGroup
  events: any
  public clubdetails: any
  public image = ''
  ngOnInit() {
    this.form = this.formBuilder.group({
      text: '',
    })
    this.id = this.sharedService.data$.subscribe((data: any) => {
      this.param = data;
      this.processData();
    });

    // Retrieve saved data from local storage
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      this.processData();
    }
  }

  ngOnDestroy() {
    this.id.unsubscribe(); // Unsubscribe to avoid memory leaks
  }
  processData() {
    if (this.param) {
      localStorage.setItem('myData', JSON.stringify(this.param));
      // this.isAuthenticated();
      this.getDetails()
      this.getEvents()
    }
  }
  getEvents() {
    this.clubService.getEvents(this.param)
      .subscribe((data) => {
        this.events = data;
      });
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

  submit(): void {
    let user = this.form.getRawValue()
    if (/^\s*$/.test(user.text)) {
      this.toastr.warning('please enter a Event', 'Warning')
    } else {
      this.clubService.addEvents(this.param, user)
        .subscribe((response: any) => {
          this.toastr.success('Event added successfully', 'Success')
          this.getEvents()
          this.form = this.formBuilder.group({
            text: '',
          })
        }, (err) => {
          Swal.fire('Error', err.error.message, "error")
      })
    }
  }

  deleteEvent(id: any) {
    this.confirmService.showConfirm("Are you sure to Delete Event?", () => {
      let deleteId = {
        id: id,
      }
      this.clubService.deleteEvent(this.param, deleteId)
        .subscribe((response: any) => {
          this.toastr.success('Event deleted successfully', 'Success')
          this.getEvents()
        }, (err) => {
          Swal.fire('Error', err.error.message, "error")
        })
    }, () => {
      this.toastr.warning('Deletion Cancelled!', 'Success')
    })
  }

  navigateToPayment() {
    this.router.navigate(['/club/payment'])
  }
}