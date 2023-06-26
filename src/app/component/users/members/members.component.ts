import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared-service.service';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import {NgConfirmService} from 'ng-confirm-box'
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent {
  private readonly url=environment.apiUrl
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
public image: string = '';
   displayedColumn: string[] = ['name', 'email', 'role','view','Action'];
  public id: any; // Subscription reference
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<{_id:any ; image:string; name: string;  role: string  }>([]);

  constructor(private formBuilder: FormBuilder, private http: HttpClient,public toastr:ToastrService,
    public authService: AuthService,public clubService: ClubServiveService,
    private router: Router,   private sharedService: SharedService,private confirmService:NgConfirmService,private _route:ActivatedRoute) { }

  searchText:any=''
  ngOnInit() {
    
    // this.id = this.sharedService.data$.subscribe((data: any) => {
    //   this.param = data;     
    //   this.processData();
    // });
    // this._route.params.subscribe(params=>{
    //   this.param=params['clubId']
    //   this.processData();
    //     }) 
    
    this.form = this.formBuilder.group({
      member: ''
    });

    // Retrieve saved data from local storage
 
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      
      this.processData();
    }
    this.getMembers(); 
  }

  selectItem(imageUrl: string, name: string,place:string,email:string,phone:string) {
    this.selectedImage = imageUrl;
    this.selectedText = name;
    this.selectedPlace = place;
    this.selectedEmail = email;
    this.selectedPhone = phone;
  }

  // ngOnDestroy() {
  //   this.id.unsubscribe(); // Unsubscribe to avoid memory leaks
  // }



  validateEmail = (email: any) => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }
  // saveData() {
  //   localStorage.setItem('myData', this.param);
  // }

  // retrieveData() {
  //   const storedData = localStorage.getItem('myData');
  //   this.param = storedData;
  // }

// isAuthenticated() {
//   this.authService.authentication(this.param)
//     .subscribe((response: any) => {
//       if (response.authenticated) {
//         this.getMembers();
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
    if (user.member == "") {
      this.toastr.warning('All fields are needed','Warning')
    } else if (!this.validateEmail(user.member)) {
      Swal.fire('Please enter a valid Email!', 'Warning!');
    } else {
     this.clubService.addMember(this.param,user).subscribe((response:any) =>{
       this.getMembers()
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



  getDetails() {
    this.clubService.getClubData(this.param)
        .subscribe((response: any) => {
          this.leaders = response.data;
          this.image = `${this.url}/public/user_images/`+this.leaders.image 
          if (response.data.president._id === response.user.id || response.data.president._id === response.user.id) {
            this.leader = true;
          }
          Emitters.authEmiter.emit(true);
        }, (err) => {
          this.router.navigate(['/']);
        })
    };
  getMembers() {
      this.clubService.getMembers(this.param)
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

  deleteMember(id:any){ 
    this.confirmService.showConfirm("Are you sure to Delete This User?",()=>{
    console.log("nothing happpence");
    console.log(id);
    let deleteData={
     user:id,
     club:this.param
    }
 this.clubService.removeMember(deleteData).subscribe((response:any) =>{
      this.getMembers()
    } , (err) => {
      this.router.navigate(['/club/admin/members'])
      Swal.fire(err.error.message, 'Warning!');
    })
  },()=>{
    this.toastr.warning('Deleting process cancelled','Success')
  })
  }
  processData() {
    if (this.param) {
      // Save the data in local storage
      // localStorage.setItem('myData', JSON.stringify(this.param));
      // this.isAuthenticated(); 
      this.getMembers();
      this.getDetails() 
    }
  }
}




