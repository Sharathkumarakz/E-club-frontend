import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-club-profile',
  templateUrl: './club-profile.component.html',
  styleUrls: ['./club-profile.component.css']
})
export class ClubProfileComponent implements OnInit {
  private readonly url=environment.apiUrl
  public id: any; // Subscription reference
  constructor(
    private _formBuilder: FormBuilder,
    private _sharedService: SharedService,
    private _router: Router,
    public _toastr:ToastrService,
    public _clubService: ClubServiveService,
    public _authService:AuthService
  ) {}
  public clubdetails:any
  public param: any;
  form: FormGroup;
  selectedFile: any | File = null;
  selectedFile2: any | File = null;
   public image: any = '';
  public posts: any[];
  selectedImage: string = '';
  selectedText: string = '';
  public count: number = 0
  public leader:boolean=false;
  ngOnInit() {
    this.id = this._sharedService.data$.subscribe((data: any) => {
      this.param = data;
      this.processData();
    });

    this.form = this._formBuilder.group({
      caption: ''
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


  selectItem(imageUrl: string, text: string) {
    this.selectedImage = imageUrl;
    this.selectedText = text;
  }

  getPost() {
    this._clubService.getPost(this.param)
    .subscribe((response: any) => {
      this.posts = response;
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this._router.navigate(['/']);
    });
  }

  getDetails() {
  this._clubService.getClubData(this.param)
      .subscribe((response: any) => {
        this.clubdetails = response.data;
        this.image = `${this.url}/public/user_images/`+ this.clubdetails.image
        if (response.data.president._id === response.user.id || response.data.president._id === response.user.id) {
          this.leader = true;
        }
        Emitters.authEmiter.emit(true);
      }, (err) => {
        this._router.navigate(['/']);
      })
  };


  // isAuthenticated() {
  //   this._authService.authentication(this.param)
  //     .subscribe((response: any) => {
  //       if (response.authenticated) {
  //       } else {
  //         this._toastr.warning('You are not a part of this Club', 'warning')
  //         setTimeout(() => {
  //           this._router.navigate(['/'])
  //         }, 2000);
  //       }
  //       Emitters.authEmiter.emit(true);
  //     }, (err) => {
  //       this._router.navigate(['/']);
  //       Emitters.authEmiter.emit(false);
  //     });
  // }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  onFileSelecting(event: any) {
    this.selectedFile2 = <File>event.target.files[0];
  }

  onSubmit(){
    const formData = new FormData();
   formData.append('image', this.selectedFile, this.selectedFile.name);   
  this._clubService.clubProfilePictureUpdate(this.param,formData)
  .subscribe((response:any)=>{
    this.getDetails()
    Emitters.authEmiter.emit(true);
   this._toastr.success('Saved','Success')
  }, (err) => {
   Swal.fire('Error', err.error.message, 'error');
     });
  }

postOnSubmit(){
    let user = this.form.getRawValue();
    const formData = new FormData();
    formData.append('image', this.selectedFile2, this.selectedFile2.name);
    formData.append('textFieldName', JSON.stringify(user));
    this._clubService.addPost(this.param, formData)
    .subscribe((response)=>{
      this.getPost();
      Emitters.authEmiter.emit(true);
          this._toastr.success('Saved','Success')
    }, (err) => {
      Swal.fire('Error', err.error.message, 'error');
    });
}

deletePost(id: string){
  this._clubService.deletePost(id)
  .subscribe((Response)=>{
    this.getPost()
    Emitters.authEmiter.emit(true);
    this._toastr.success('Saved','Success')
  }, (err) => {
        Swal.fire('Error', err.error.message, 'error');
   });
}

  processData() {
    if (this.param) {
      // Save the data in local storage
      localStorage.setItem('myData', JSON.stringify(this.param));
      // this.isAuthenticated();
      this.getPost();
      this.getDetails();
    }
  }

}
