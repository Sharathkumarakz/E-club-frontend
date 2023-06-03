import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared-service.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-members-club-profile',
  templateUrl: './members-club-profile.component.html',
  styleUrls: ['./members-club-profile.component.css']
})
export class MembersClubProfileComponent implements OnInit {

 
  public id: any; // Subscription reference
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private http: HttpClient,
    private router: Router,
    private toastr:ToastrService
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
        this.router.navigate(['/club/admin/members'])
      }else if (response.secretory) {
        this.router.navigate(['/club/admin/members'])
      }else if (response.treasurer) {
      }else if(response.member){ 
      }else{
        this.toastr.warning('You are not a part of this Club','warning')
        setTimeout(() => {
        }, 2000);
      }
      Emitters.authEmiter.emit(true);
    }, (err) => {
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
      this.name = response.clubName;
      this.place = response.place;
      this.registerNo = response.registerNo;
      this.category = response.category;
      this.image = response.image;
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
