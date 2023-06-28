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

  public id: string;
  public clubdetails: any
  public param: string;
  form: FormGroup;
  selectedFile: any | File = null;
  selectedFile2: any | File = null;
  public image: any = '';
  public posts: any[];
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

    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      this.processData();
    }
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
        this.image = this.clubdetails.image
        if (response.data.president._id === response.user.id || response.data.secretory._id === response.user.id) {
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

  onSubmit() {
    const formData = new FormData();
    if(!this.selectedFile ){
      this._toastr.warning('select a image!')
      return
    }
    this.image = ''
    this.load = true
    formData.append('image', this.selectedFile, this.selectedFile.name);
    this._clubService.clubProfilePictureUpdate(this.param, formData)
      .subscribe((response) => {
        this.load = false
        this.getDetails()
        Emitters.authEmiter.emit(true);
        this._toastr.success('Saved', 'Success')
      }, (err) => {
        Swal.fire('Error', err.error.message, 'error');
      });
  }

  postOnSubmit() {
    let user = this.form.getRawValue();
    const formData = new FormData();
    if(!this.selectedFile2 ){
      this._toastr.warning('select a image!')
      return
    }
    this.load1 = true
    formData.append('image', this.selectedFile2, this.selectedFile2.name);
    formData.append('textFieldName', JSON.stringify(user));
    this._clubService.addPost(this.param, formData)
      .subscribe((response) => {
        this.load1 = false
        this.getPost();
        Emitters.authEmiter.emit(true);
        this._toastr.success('Saved', 'Success')
      }, (err) => {
        this._toastr.warning(err.error.message,'Warning')
      });
  }

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
          .subscribe((Response) => {
            this.load = false
            this.getPost()
            Emitters.authEmiter.emit(true);
          }, (err) => {
            this._toastr.warning( err.error.message, 'error');
            this._router.navigate(['/'])
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

  processData() {
    if (this.param) {
      this.getPost();
      this.getDetails();
    }
  }

  goToClubSettings() {
    this._router.navigate(['/club/settings', this.param])
  }

}
