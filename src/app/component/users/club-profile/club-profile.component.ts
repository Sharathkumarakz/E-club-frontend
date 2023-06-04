import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared-service.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-club-profile',
  templateUrl: './club-profile.component.html',
  styleUrls: ['./club-profile.component.css']
})
export class ClubProfileComponent implements OnInit {

  public id: any; // Subscription reference
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private http: HttpClient,
    private router: Router,
    public toastr:ToastrService
  ) {}

  public param: any;
  form: FormGroup;
  selectedFile: any | File = null;
  selectedFile2: any | File = null;
  public name: any = '';
  public place: any = '';
  public registerNo: any = '';
  public category: any = '';
  public image: any = '';
  public posts: any[];
  selectedImage: string = '';
  selectedText: string = '';
  public leader:boolean=false;
  ngOnInit() {
    this.id = this.sharedService.data$.subscribe((data: any) => {
      this.param = data;
      this.processData();
    });

    this.form = this.formBuilder.group({
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

  isAuthenticated() {
    this.http.get('http://localhost:5000/club/roleAuthentication/' + this.param, {
      withCredentials: true
    }).subscribe((response: any) => {
      if (response.president) {
        this.router.navigate(['/club/clubProfile'])
        }else if (response.secretory) {
          this.router.navigate(['/club/clubProfile'])
      }else if (response.treasurer) {
        this.router.navigate(['/club/clubProfile'])
      }else if(response.member){
        this.router.navigate(['/club/clubProfile'])
      }else{
        this.toastr.warning('You are not a part of this Club','warning')
        setTimeout(() => {
          this.router.navigate(['/'])
        }, 2000);
      }
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this.router.navigate(['/']);
      Emitters.authEmiter.emit(false);
    });
  }

  getPost() {
    this.http.get('http://localhost:5000/club/posts/' + this.param, {
      withCredentials: true
    }).subscribe((posts: any) => {
      this.posts = posts;
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this.router.navigate(['/']);
    });
  }

  getDetails() {
    this.http.get('http://localhost:5000/club/' + this.param, {
      withCredentials: true
    }).subscribe((response: any) => {
      this.name = response.data.clubName;
      this.place = response.data.place;
      this.registerNo = response.data.registerNo;
      this.category = response.data.category;
      this.image = response.data.image;
      if(response.data.president._id===response.user.id ||response.data.president._id===response.user.id ){
        this.leader=true;
       }
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this.router.navigate(['/']);
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  onFileSelecting(event: any) {
    this.selectedFile2 = <File>event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
    this.http.post('http://localhost:5000/club/pictureUpdate/' + this.param, formData, {
      withCredentials: true
    }).subscribe((response: any) => {
      this.image = response.image;
      Emitters.authEmiter.emit(true);
      this.toastr.success('Saved','Success')
    }, (err) => {
      Swal.fire('Error', err.error.message, 'error');
    });
  }

  postOnSubmit() {
    let user = this.form.getRawValue();
    const formData = new FormData();
    formData.append('image', this.selectedFile2, this.selectedFile2.name);
    formData.append('textFieldName', JSON.stringify(user));
    this.http.post('http://localhost:5000/club/addPost/' + this.param, formData, {
      withCredentials: true
    }).subscribe((response: any) => {
      this.posts = response;
      Emitters.authEmiter.emit(true);
      this.toastr.success('Saved','Success')
    }, (err) => {
      Swal.fire('Error', err.error.message, 'error');
    });
  }

  deletePost(id: string) {
    this.http.get('http://localhost:5000/club/deletePost/' + id, {
      withCredentials: true
    }).subscribe((response: any) => {
      this.posts = response;
      Emitters.authEmiter.emit(true);
      this.toastr.success('Saved','Success')
    }, (err) => {
      Swal.fire('Error', err.error.message, 'error');
    });
  }

  processData() {
    if (this.param) {
      // Save the data in local storage
      localStorage.setItem('myData', JSON.stringify(this.param));

      this.isAuthenticated();
      this.getPost();
      this.getDetails();
    }
  }

}
