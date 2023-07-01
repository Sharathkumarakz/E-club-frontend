import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { AuthService } from 'src/app/service/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-club-profile',
  templateUrl: './club-profile.component.html',
  styleUrls: ['./club-profile.component.css']
})

export class ClubProfileComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    public _toastr: ToastrService,
    public _clubService: ClubServiveService,
    public _authService: AuthService,
    public _route: ActivatedRoute
  ) { }
  public loader:boolean=true
  public id: string;
  public clubdetails: any
  public param: string;
  form: FormGroup;
  selectedFile: any | File = null;
  selectedFile2: any | File = null;
  public image: string = '';
  public posts: any=[];
  selectedImage: string = '';
  selectedText: string = '';
  public count: number = 0
  public leader: boolean = false;
  public load: boolean = false;
  public load1: boolean = false;

  ngOnInit() {
    this.form = this._formBuilder.group({
      caption: ''
    });
//getting clubId from localstorage
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      this.processData();
    }
  }

  //selected item for post view
  selectItem(imageUrl: string, text: string) {
    this.selectedImage = imageUrl;
    this.selectedText = text;
  }

  //get all posts
  getPost() {
    this._clubService.getPost(this.param)
      .subscribe({
        next:(response)=>{
        this.posts=response
        Emitters.authEmiter.emit(true);
        },
        error:()=>{
          this._router.navigate(['/']);
        }
      })
  }

  //get clubDetails
  getDetails() {
    this._clubService.getClubData(this.param)
      .subscribe({
        next:(response:any)=>{
        this.clubdetails = response.data;
        this.image = this.clubdetails.image
        if (response.data.president._id === response.user.id || response.data.secretory._id === response.user.id) {
          this.leader = true;
        }
        Emitters.authEmiter.emit(true);
        this.loader=false;
        },
        error:()=>{
          this._router.navigate(['/']);
        }
      })
  };

  //selected image for post
  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  //selected image for post
  onFileSelecting(event: any) {
    this.selectedFile2 = <File>event.target.files[0];
  }

  //profile picture updating
  onSubmit() {
    const formData = new FormData();
    if(!this.selectedFile){
      this._toastr.info('select a image!')
      return
    }
    this.image = ''
    this.load = true
    formData.append('image', this.selectedFile, this.selectedFile.name);
    this._clubService.clubProfilePictureUpdate(this.param, formData)
      .subscribe({
        next:()=>{
        this.load = false
        this.getDetails()
        Emitters.authEmiter.emit(true);
        this._toastr.success('Saved', 'Success')
        this.selectedFile=null
        this.selectedFile.name=null
        },
        error:(err)=>{
          this._toastr.warning(err.error.message, 'Success')        
        }
      })
  }

  //adding a club post
  postOnSubmit() {
    let user = this.form.getRawValue();
    const formData = new FormData();
    if(!this.selectedFile2 ){
      this._toastr.info('select a image!')
      return
    }
    this.load1 = true
    formData.append('image', this.selectedFile2, this.selectedFile2.name);
    formData.append('textFieldName', JSON.stringify(user));
    this._clubService.addPost(this.param, formData)
      .subscribe({
        next:()=>{
        this.load1 = false
        this.getPost();
        Emitters.authEmiter.emit(true);
        this._toastr.success('Saved', 'Success')
        this.selectedFile2=null
         this.selectedFile2.name=null
        },
        error:(err)=>{
          this._toastr.warning(err.error.message,'Warning') 
        }
      })
  }

  //deleting a club post
  deletePost(id: string) {
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
          this._clubService.deletePost(id)
          .subscribe({
            next:()=>{
            this.load = false
            this.getPost()
            Emitters.authEmiter.emit(true);
            },
            error:(err)=>{
            this._toastr.warning( err.error.message, 'error');
            this._router.navigate(['/']) 
            }
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

  //process functions
  processData() {
    if (this.param) {
      this.getPost();
      this.getDetails();
    }
  }

  //navigation to club settings
  goToClubSettings() {
    this._router.navigate(['/club/settings', this.param])
  }

//leave from club
  leaveFromClub(){


    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
      swalWithBootstrapButtons.fire({
      title: 'Are you sure? You Want to Leave?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, leaving club',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result:any) => {
      if (result.isConfirmed) {
        this._authService.leaveFromClub(this.clubdetails._id).subscribe((res)=>{
          if(res){
           this._router.navigate(['/'])
          }
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

  }

