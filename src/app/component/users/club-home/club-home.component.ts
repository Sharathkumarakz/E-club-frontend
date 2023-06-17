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
 import { ChatService } from 'src/app/service/chat.service';
 import { appUserService } from 'src/app/component/userState/appUser.Service';
 import { Profile } from 'src/app/component/userState/models';
 import { Store, select } from '@ngrx/store';
import { retrieveprofile } from 'src/app/component/userState/appAction';
import { userProfile } from 'src/app/component/userState/app.selectctor';
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-club-home',
  templateUrl: './club-home.component.html',
  styleUrls: ['./club-home.component.css']
})

export class ClubHomeComponent {
  private readonly url = environment.apiUrl

  constructor(
 private appService: appUserService, 
 private store: Store<{ userdetails: Profile }>,
  private toastr: ToastrService,
   private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private clubService: ClubServiveService,
     private _chatService: ChatService,
    private authService: AuthService) { 
      //--------------------------------------------------
      this._chatService.newUserJoined()
      .subscribe((data)=>{
        this.getActiveMember() 
      })

this._chatService.userLeftRoom()
.subscribe((data)=>{
  this.getActiveMember()
}

)

this._chatService.newMessageReceived()
.subscribe(data=>
  this.messageArray.push(data)
  )
      //--------------------------------------------------

    }
  public param: any
  public leader: boolean = false
  public handler: any = null
  public id = this.sharedService.data$.subscribe(data => {
    this.param = data
  });
//-----------------------------------
public messageText:string=''
  public user: any
  public room: string =''
  public messageArray:Array<{user:any, message:String,time:any,room:String}>=[]
  public activeMembers:any
  
  //----------------------------------
  sss$ = this.store.pipe(select(userProfile)).subscribe(userProfileData => {
this.user=userProfileData
  })
  form: FormGroup
  events: any
  public clubdetails: any
  public image = ''
  ngOnInit() {
    this.store.dispatch(retrieveprofile())
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
this.leaveRoom()
  }
  processData() {
    if (this.param) {
      localStorage.setItem('myData', JSON.stringify(this.param));
      // this.isAuthenticated();
      this.getDetails()
      this.getEvents()
      this.getOldMessages(this.param)
      this.getActiveMember()
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
        if (response.data.president._id === response.user.id || response.data.secretory._id === response.user.id) {
          this.leader = true;
        }
        this.room=response.data._id
        Emitters.authEmiter.emit(true);
      this.joinChat()

      }, (err) => {
        this.router.navigate(['/']);
      })
  };

//--------------------------------------------------------------------------------------

joinChat(){
  this._chatService.joinRoom({user:this.user,room:this.room})
}

leaveRoom(){
  this._chatService.leaveRoom({user:this.user,room:this.room})
}



sendMessage(){
const time=Date.now() 
console.log("ttttttttttttu",time);

  this._chatService.sendMessage({user:this.user,room:this.room,message:this.messageText,time:time})
  this.messageText=''
}

getOldMessages(id: string): void {
  this._chatService.getOldMessages(this.param).subscribe(
    (data) => {
      console.log(data);
      
      this.messageArray = data;
    },
    (error) => {
      console.error(error);
    }
  );
}


getActiveMember(){
  this._chatService.getActiveMembers(this.param).subscribe(
    (data) => {
      console.log(data,"hmmmmmmmmmmmmmmmm");
      this.activeMembers = data;
    },
    (error) => {
      console.error(error);
    }
  );
}


//--------------------------------------------------------------------------------------
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