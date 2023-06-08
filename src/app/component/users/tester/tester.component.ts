import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared-service.service';
import { Emitters } from 'src/app/component/users/emitters/emitters';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  styleUrls: ['./tester.component.css']
})
export class TesterComponent implements OnInit, OnDestroy {
  displayedColumn: string[] = ['name', 'email', 'role','view','Action'];

  form: FormGroup;
  param: any;
  users: any;
  leader: boolean = false;
  leaders: any;
  selectedImage: string = '';
  selectedText: string = '';
  selectedEmail: string = '';
  selectedPlace: string = '';
  selectedPhone: string = '';
  name: string = '';
  id: any; // Subscription reference
  dataSource = new MatTableDataSource<{_id:any ; image:string; name: string;  role: string  }>([]);
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    public toastr: ToastrService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  searchText: any = '';

  ngOnInit() {
    this.id = this.sharedService.data$.subscribe((data: any) => {
      this.param = data;
      this.processData();
    });

    this.form = this.formBuilder.group({
      member: ''
    });

    // Retrieve saved data from local storage
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      this.processData();
      this.getMembers();
    }
  }

  selectItem(imageUrl: string, name: string, place: string, email: string, phone: string) {
    this.selectedImage = imageUrl;
    this.selectedText = name;
    this.selectedPlace = place;
    this.selectedEmail = email;
    this.selectedPhone = phone;
  }

  ngOnDestroy() {
    this.id.unsubscribe(); // Unsubscribe to avoid memory leaks
  }

  saveData() {
    localStorage.setItem('myData', this.param);
  }

  retrieveData() {
    const storedData = localStorage.getItem('myData');
    this.param = storedData;
  }

  isAuthenticated() {
    this.http
      .get('http://localhost:5000/club/roleAuthentication/' + this.param, {
        withCredentials: true
      })
      .subscribe((response: any) => {
        if (response.authenticated) {
        } else {
          this.toastr.warning('You are not a part of this club', 'Warning');
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        }

        Emitters.authEmiter.emit(true);
      });
  }
  deleteMember(id:any){ 
    console.log(id);
    let deleteData={
     user:id,
     club:this.param
    }
    this.http.post('http://localhost:5000/club/deleteMember',deleteData, {     
      withCredentials: true
    }).subscribe((response:any) =>{
      this.getMembers()
    } , (err) => {
      this.router.navigate(['/club/admin/members'])
      Swal.fire(err.error.message, 'Warning!');
    })
  }
  getMembers() {
    this.http
      .post('http://localhost:5000/club/members/test/' + this.param, {
        withCredentials: true
      })
      .subscribe(
        (response: any) => {
          console.log('members', response);
          this.dataSource.data = response.members;
          this.dataSource.paginator=this.paginator
          this.dataSource.sort=this.sort
        },
        (err) => {
          this.router.navigate(['/club/admin/members']);
          Swal.fire(err.error.message, 'Warning!');
        }
      );
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter= filterValue.trim().toLowerCase()
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage()
    }
  }

  active() {
    this.http
      .get('http://localhost:5000/club/' + this.param, {
        withCredentials: true
      })
      .subscribe(
        (response: any) => {
          this.name = response.data.clubName;
          if (response.data.president._id === response.user.id || response.data.president._id === response.user.id) {
            this.leader = true;
          }
          console.log('resssssss', response);
          Emitters.authEmiter.emit(true);
        },
        (err) => {
          this.router.navigate(['/']);
        }
      );
  }

  processData() {
    if (this.param) {
      // Save the data in local storage
      localStorage.setItem('myData', JSON.stringify(this.param));

      this.isAuthenticated();
      this.getMembers();
      this.active();
    }
  }
}