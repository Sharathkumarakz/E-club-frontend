import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared-service.service';
import { HttpClient } from '@angular/common/http';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-club-admin',
  templateUrl: './club-admin.component.html',
  styleUrls: ['./club-admin.component.css']
})
export class ClubAdminComponent implements OnInit {
  constructor(private formBuilder: FormBuilder,
    private router: Router, route: ActivatedRoute, private sharedService: SharedService, private http: HttpClient,public toastr:ToastrService) { }
  public param: any
  public id = this.sharedService.data$.subscribe(data => {
    this.param = data // Handle received data
  });
  form: FormGroup
  events: any
  public name: any = ''
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

  isAuthenticated() {
    this.http.get('http://localhost:5000/club/roleAuthentication/' + this.param, {
      withCredentials: true
    }).subscribe((response: any) => {
      if (response.president) {
      } else if (response.secretory) {
      } else if (response.treasurer) {
        this.router.navigate(['/club'])
      } else if (response.member) {
        this.router.navigate(['/club'])
      } else {
        this.toastr.warning('You are not a part of this club','Warning')
        setTimeout(() => {
          this.router.navigate(['/'])
        }, 2000);
      }

      Emitters.authEmiter.emit(true);
    }, (err) => {
      this.router.navigate(['/']);
      Emitters.authEmiter.emit(false);
    });
  }
  processData() {
    if (this.param) {
      // Save the data in local storage
      localStorage.setItem('myData', JSON.stringify(this.param));
      this.getEvents();
      this.isAuthenticated();
    }
  }
  getEvents() {
    this.http.get('http://localhost:5000/club/events/' + this.param, {
      withCredentials: true
    }).subscribe((response) => {
      this.events = response
    }, (err) => {
      Swal.fire('Error', err.error.message, "error")
    })

  }

  submit(): void {
    let user = this.form.getRawValue()
    if (user.text == "") {
      this.toastr.warning('please enter a Event','Warning')
    } else {
      this.http.post('http://localhost:5000/club/addEvent/' + this.param, user, {
        withCredentials: true
      }).subscribe((response) => {
        Swal.fire('Event Added successfully', "Success")
        this.events = response
        this.form = this.formBuilder.group({
          text: '',
        })
      }, (err) => {
        Swal.fire('Error', err.error.message, "error")
      })
    }
  }

  deleteEvent(id:any){
  let user={
    id:id,
  }
    this.http.post('http://localhost:5000/club/deleteEvent/'+this.param,user,{
        withCredentials: true
      }).subscribe((response) => {
        Swal.fire('Event Deleted successfully', "Success")
        this.events = response
      }, (err) => {
        Swal.fire('Error', err.error.message, "error")
      })
  }
}

