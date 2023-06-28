
import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared-service.service';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { ToastrService } from 'ngx-toastr';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import Swal from 'sweetalert2';
declare var JitsiMeetExternalAPI:any

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})

export class MeetingsComponent implements OnInit{
  isAudioMuted:boolean = false
  isVideoMuted:boolean = false
  domain:string='meet.jit.si'
  room:any;
  user:any;
  api:any;
  options:any
  public messageText=''
leader:boolean=false;
id:any;
param:string;
clubdetails$:any;

constructor(
  private _router: Router,
  private _sharedService:SharedService,
  private _clubService:ClubServiveService,
  public _toastr:ToastrService){}

ngOnInit(): void {

    this.room='jitsiMeetingAPIExample';
    this.user={
      name:'E-Club Meet'
    }

    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      this.processData();
    }

  }


  ngOnDestroy() {
    this.disposeVideoCall();
  }

  processData() {
    if (this.param) {
      this.getDetails()
    }
  }

  getDetails() {
    this._clubService.getClubData(this.param)
      .subscribe((response: any) => {
        this.clubdetails$= response.data;
        if (response.data.president._id === response.user.id || response.data.secretory._id === response.user.id) {
          this.leader = true;
          this.videoStart()
        }
        this.messageText=response.data.conference
        this.room=response.data._id
        Emitters.authEmiter.emit(true);
      }, (err) => {
        this._router.navigate(['/']);
      })
  };

videoStart(){
  this.options={
    roomName:this.room, 
     configOverWrite:{proJoinPageEnabe:false},
     interfaceConfigOverWrite:{
      TILE_VIEW_MAX_COLUMNS:8
      },
      parantNode:document.querySelector('#jist-iframe'),
      userInfo:{
        displayName:this.user.name
      }
   }
   this.api= new JitsiMeetExternalAPI(this.domain,this.options);

   //event Handling
   this.api.addEventListerners({
    redyToClose:this.handleClose,
    participantLeft:this.handleParticipantLeft,
    participantJoined:this.handleParticipantJoined,
    videoConferenceJoined:this.handleVideoConferenceJoined,
    videoConferenceLeft:this.handleVideoConferenceLeft,
    AudioMuteStatusChanged:this.handleAudioMuteStatusChanged,
    VideoMuteStatusChanged:this.handleVideoMuteStatusChanged

   })
   }
   handleClose=()=>{
console.log('closing meet');

   }
   handleParticipantLeft= async(participant:any)=>{
     const data=await this.getParticipants()
   }

   handleParticipantJoined= async(participant:any)=>{
     const data=await this.getParticipants()
   }

   handleVideoConferenceJoined= async(participant:any)=>{
    const data=await this.getParticipants()
   }

   handleVideoConferenceLeft=()=>{
         this._router.navigate(['/']);
   }

   handleAudioMuteStatusChanged=(audio:any)=>{
    console.log("handleAudioMuteStatusChanged",audio);
   }


   handleVideoMuteStatusChanged=(video:any)=>{
    console.log("handleAudioMuteStatusChanged",video);
   }

   getParticipants(){
    return new Promise((resolve, reject) =>{
      setTimeout(()=>{
  resolve(this.api.getParticipantsInfo())
      },500)
    })
   }



   executeCommand(command:string){
    this.api.executeCommand(command)
    if(command==='hangup'){
    this._router.navigate(['/'])
    }
    if(command==='toggleAudio'){
    this.isAudioMuted=!this.isAudioMuted
      }
      if(command==='toggleVideo'){
        this.isVideoMuted=!this.isVideoMuted
     }
   }


   getLink() {
    this._clubService.getClubData(this.param)
      .subscribe((response: any) => {
        this.clubdetails$= response.data;
      }, (err) => {
        this._router.navigate(['/']);
      })
  };
   sendMessage(){
   if (/^\s*$/.test(this.messageText)){
    this._toastr.warning('please give a link', 'Warning') 
   }else{
    let data={
      text:this.messageText,
    }
    this._clubService.Conference(this.param,data)
    .subscribe((response: any) => {
      this.getLink() 
      this._toastr.success('Updated successfully', 'Success') 
    })
   }
   }

   removeConference(){
 


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
      confirmButtonText: 'Yes, Remove it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._clubService.removeConference(this.param)
        .subscribe((response: any) =>{
          this.messageText=''
          this.getLink() 
        })
        swalWithBootstrapButtons.fire(
          'Success!',
          'Link Removed Successfully',
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

   disposeVideoCall() {
    if (this.api) {
      this.api.dispose(); // Cleanup Jitsi Meet API instance
      this.api = null; // Reset the API instance
    }
  }


}