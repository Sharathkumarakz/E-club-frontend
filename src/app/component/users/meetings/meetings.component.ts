
import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared-service.service';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { ToastrService } from 'ngx-toastr';
import { ClubServiveService } from 'src/app/service/club-servive.service';

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

constructor(private router: Router,private sharedService:SharedService,private clubService:ClubServiveService,public toastr:ToastrService){}

ngOnInit(): void {
    this.room='jitsiMeetingAPIExample';
    this.user={
      name:'E-Club Meet'
    }
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
  }


  ngOnDestroy() {
    // this.id.unsubscribe(); // Unsubscribe to avoid memory leaks
    this.disposeVideoCall();
  }
  processData() {
    if (this.param) {
      // this.isAuthenticated();
      this.getDetails()
    }
  }

  getDetails() {
    this.clubService.getClubData(this.param)
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
        this.router.navigate(['/']);
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
         this.router.navigate(['/']);
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
    this.router.navigate(['/'])
    }
    if(command==='toggleAudio'){
    this.isAudioMuted=!this.isAudioMuted
      }
      if(command==='toggleVideo'){
        this.isVideoMuted=!this.isVideoMuted
     }
   }


   getLink() {
    this.clubService.getClubData(this.param)
      .subscribe((response: any) => {
        this.clubdetails$= response.data;
      }, (err) => {
        this.router.navigate(['/']);
      })
  };
   sendMessage(){
   if (/^\s*$/.test(this.messageText)){
    this.toastr.warning('please give a link', 'Warning') 
   }else{
    let data={
      text:this.messageText,
    }
    this.clubService.Conference(this.param,data)
    .subscribe((response: any) => {
      this.getLink() 
      this.toastr.success('Updated successfully', 'Success') 
    })
   }
   }

   removeConference(){
    this.clubService.removeConference(this.param)
    .subscribe((response: any) =>{
      this.messageText=''
      this.getLink() 
      this.toastr.success('Updated successfully', 'Success') 
    })
   }


   disposeVideoCall() {
    if (this.api) {
      this.api.dispose(); // Cleanup Jitsi Meet API instance
      console.log("happening........");
      this.api = null; // Reset the API instance
    }
  }


}