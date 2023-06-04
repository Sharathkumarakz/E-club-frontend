import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared-service.service';
import { Emitters } from 'src/app/component/users/emitters/emitters';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent {
  form: FormGroup
  public param: any;
  public users:any;
 public leader:boolean=false
 public leaders:any
  selectedImage: string = '';
  selectedText: string = '';
  selectedEmail: string = ''; 
  selectedPlace: string = ''; 
   selectedPhone: string = '';
   public name: string =''
  public id: any; // Subscription reference
  constructor(private formBuilder: FormBuilder, private http: HttpClient,public toastr:ToastrService,
    private router: Router,   private sharedService: SharedService) { }

  searchText:any=''
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
    }
  }

  selectItem(imageUrl: string, name: string,place:string,email:string,phone:string) {
    this.selectedImage = imageUrl;
    this.selectedText = name;
    this.selectedPlace = place;
    this.selectedEmail = email;
    this.selectedPhone = phone;
  }

  ngOnDestroy() {
    this.id.unsubscribe(); // Unsubscribe to avoid memory leaks
  }



  validateEmail = (email: any) => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }
  saveData() {
    localStorage.setItem('myData', this.param);
  }

  retrieveData() {
    const storedData = localStorage.getItem('myData');
    this.param = storedData;
  }

  isAuthenticated(){
    this.http.get('http://localhost:5000/club/roleAuthentication/'+this.param, {
      
      withCredentials: true
    }).subscribe((response: any) => {
      if (response.authenticated) {
      }else{
        this.toastr.warning('You are not a part of this club','Warning')
        setTimeout(() => {
          this.router.navigate(['/'])
        }, 2000);
      }

      Emitters.authEmiter.emit(true);
  })
}

  submit(): void {
    let user = this.form.getRawValue()
    if (user.member == "") {
      this.toastr.warning('All fields are needed','Warning')
    } else if (!this.validateEmail(user.member)) {
      Swal.fire('Please enter a valid Email!', 'Warning!');
    } else {
      this.http.post('http://localhost:5000/club/addMember/'+this.param, user, {
        withCredentials: true
      }).subscribe((response:any) =>{
        this.users = response
        this.toastr.success('Added Successfully','Success')
       this.form = this.formBuilder.group({
        member: ''
        
      })
      } , (err) => {
        this.router.navigate(['/club/admin/members'])
        this.form = this.formBuilder.group({
          member: ''        
        })
        Swal.fire(err.error.message, 'Warning!');
      })
    }
  }

  getLeaders() {
    this.http.get('http://localhost:5000/admin/club/leaders/' + this.param, {
      withCredentials: true
    }).subscribe((response: any) => {
      this.leaders = response;
      console.log(response);
      
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this.router.navigate(['/']);
    });
  }
  getMembers(){
    this.http.post('http://localhost:5000/club/members/'+this.param, {
        withCredentials: true
      }).subscribe((response:any) =>{
      this.users = response
      } , (err) => {
        this.router.navigate(['/club/admin/members'])
        Swal.fire(err.error.message, 'Warning!');
      })
  }
  active(){
    this.http.get('http://localhost:5000/club/' + this.param, {
      withCredentials: true
    }).subscribe((response: any) => {
      this.name=response.data.clubName
     if(response.data.president._id===response.user.id ||response.data.president._id===response.user.id ){
      this.leader=true;
     }
     console.log("resssssss",response);  
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this.router.navigate(['/']);
    });
  }

  deleteMember(id:any){ 
    let deleteData={
     user:id,
     club:this.param
    }
    this.http.post('http://localhost:5000/club/deleteMember',deleteData, {
      
      withCredentials: true
    }).subscribe((response:any) =>{
    this.users = response
    } , (err) => {
      this.router.navigate(['/club/admin/members'])
      Swal.fire(err.error.message, 'Warning!');
    })
  }
  processData() {
    if (this.param) {
      // Save the data in local storage
      localStorage.setItem('myData', JSON.stringify(this.param));

      this.isAuthenticated(); 
      this.getMembers();
      this.active()
      this.getLeaders() 
    }
  }
}




