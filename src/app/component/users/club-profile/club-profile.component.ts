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
import { ActivatedRoute } from '@angular/router';
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
    public _authService:AuthService,
    public _route:ActivatedRoute
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
  public load:boolean = false;
  public load1:boolean = false;

  ngOnInit() {
    // this.id = this._sharedService.data$.subscribe((data: any) => {
    //   this.param = data;
    //   this.processData();
    // });

    this.form = this._formBuilder.group({
      caption: ''
    });
    // this._route.params.subscribe(params=>{
    //   this.param=params['clubId']
    //   this.processData()
    //     })
    // Retrieve saved data from local storage
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      this.processData();
    }
  }

  // ngOnDestroy() {
  //   this.id.unsubscribe(); // Unsubscribe to avoid memory leaks
  // }


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
        this.image =this.clubdetails.image
        if (response.data.president._id === response.user.id || response.data.president._id === response.user.id) {
          this.leader = true;
        }
        Emitters.authEmiter.emit(true);
      }, (err) => {
        this._router.navigate(['/']);
      })
  };


  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  onFileSelecting(event: any) {
    this.selectedFile2 = <File>event.target.files[0];
  }

  onSubmit(){
    this.image=''
    this.load=true
    const formData = new FormData();
   formData.append('image', this.selectedFile, this.selectedFile.name);   
  this._clubService.clubProfilePictureUpdate(this.param,formData)
  .subscribe((response:any)=>{
    this.load=false
    this.getDetails()
    Emitters.authEmiter.emit(true);
   this._toastr.success('Saved','Success')
  }, (err) => {
   Swal.fire('Error', err.error.message, 'error');
     });
  }

postOnSubmit(){
this.load1=true
    let user = this.form.getRawValue();
    const formData = new FormData();
    formData.append('image', this.selectedFile2, this.selectedFile2.name);
    formData.append('textFieldName', JSON.stringify(user));
    this._clubService.addPost(this.param, formData)
    .subscribe((response)=>{
      this.load1=false
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
    this.load=false
    this.getPost()
    Emitters.authEmiter.emit(true);
    this._toastr.success('Saved','Success')
  }, (err) => {
        Swal.fire('Error', err.error.message, 'error');
   });
}

  processData() {
    if (this.param) {
      this.getPost();
      this.getDetails();
    }
  }

  goToClubSettings(){
  this._router.navigate(['/club/settings', this.param])
  }
}
