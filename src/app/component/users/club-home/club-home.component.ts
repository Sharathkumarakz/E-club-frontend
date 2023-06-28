import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import Swal from 'sweetalert2'
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgConfirmService } from 'ng-confirm-box'
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { ChatService } from 'src/app/service/chat.service';
import { Profile } from 'src/app/component/userState/models';
import { Store, select } from '@ngrx/store';
import { retrieveprofile } from 'src/app/component/userState/appAction';
import { userProfile } from 'src/app/component/userState/app.selectctor';


@Component({
  selector: 'app-club-home',
  templateUrl: './club-home.component.html',
  styleUrls: ['./club-home.component.css']
})

export class ClubHomeComponent {

  constructor(
    private _store: Store<{ userdetails: Profile }>,
    private _toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _confirmService: NgConfirmService,
    private _clubService: ClubServiveService,
    private _chatService: ChatService,
  ) {

    //CHAT HANDLING
    this._chatService.newUserJoined()
      .subscribe((data) => {
        this.getActiveMember()
      })

    this._chatService.userLeftRoom()
      .subscribe((data) => {
        this.getActiveMember()
      })

    this._chatService.newMessageReceived()
      .subscribe(data =>
        this.messageArray.push(data))
  }


  public param: string
  public leader: boolean = false
  public handler: any = null
  public messageText: string = ''
  public user: any
  public room: string = ''
  public messageArray: Array<{ user: any, message: String, time: any, room: String }> = []
  public activeMembers: any
  form: FormGroup
  events: any
  public clubdetails: any
  public image = ''

  //GETTING DATA FROM STORE
  sss$ = this._store.pipe(select(userProfile)).subscribe(userProfileData => {
    this.user = userProfileData
  })


  ngOnInit() {
    this._store.dispatch(retrieveprofile())
    this.form = this._formBuilder.group({
      text: '',
    })
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      this.processData();
    }
  }


  ngOnDestroy() {
    this.leaveRoom()
  }

  processData() {
    if (this.param) {
      this.getDetails()
      this.getEvents()
      this.getOldMessages(this.param)
      this.getActiveMember()
    }
  }

  getEvents() {
    this._clubService.getEvents(this.param)
      .subscribe((data) => {
        this.events = data;
      });
  }

  //GETTING CLUB DETAILS
  getDetails() {
    this._clubService.getClubData(this.param)
      .subscribe((response: any) => {
        this.clubdetails = response.data;
        this.image = this.clubdetails.image
        if (response.data.president._id === response.user.id || response.data.secretory._id === response.user.id) {
          this.leader = true;
        }
        this.room = response.data._id
        Emitters.authEmiter.emit(true);
        this.joinChat()
      }, (err) => {
        this._router.navigate(['/']);
      })
  };

 //CHAT HANDLING
  joinChat() {
    this._chatService.joinRoom({ user: this.user, room: this.room })
  }

  leaveRoom() {
    this._chatService.leaveRoom({ user: this.user, room: this.room })
  }

  sendMessage() {
    const time = Date.now()
    if(/^\s*$/.test(this.messageText)){

    }else{
      this._chatService.sendMessage({ user: this.user, room: this.room, message: this.messageText, time: time })
      this.messageText = ''
    }
  
  }

  getOldMessages(id: string): void {
    this._chatService.getOldMessages(this.param).subscribe(
      (data) => {
        this.messageArray = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getActiveMember() {
    this._chatService.getActiveMembers(this.param).subscribe(
      (data) => {
        this.activeMembers = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }


//EVENT HANDLING
  submit(): void {
    let user = this.form.getRawValue()
    if (/^\s*$/.test(user.text)) {
      this._toastr.warning('please enter a Event', 'Warning')
    } else {
      this._clubService.addEvents(this.param, user)
        .subscribe((response: any) => {
          this._toastr.success('Event added successfully', 'Success')
          this.getEvents()
          this.form = this._formBuilder.group({
            text: '',
          })
        }, (err) => {
          this._toastr.warning(err.error.message,"warning")
        })
    }
  }

  deleteEvent(id: any) {

      let deleteId = {
        id: id,
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
    }).then((result) => {
      if (result.isConfirmed) {
        this._clubService.deleteEvent(this.param, deleteId).subscribe((response: any) => {
          this.getEvents()
        }, (err) => {
          this._toastr.warning(err.error.message,'Warning')
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

  //NAVIGATION TO PAYMENT PAGE
  navigateToPayment() {
    this._router.navigate(['/club/payment'])
  }

}