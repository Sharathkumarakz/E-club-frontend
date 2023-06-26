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
  selector: 'app-club-view',
  templateUrl: './club-view.component.html',
  styleUrls: ['./club-view.component.css']
})
export class ClubViewComponent implements OnInit {
  private readonly url=environment.apiUrl
  public id: any; // Subscription reference
  constructor(
  
    private _router: Router,
    public _toastr:ToastrService,
    public _clubService: ClubServiveService,
    public _authService:AuthService,
    public _route:ActivatedRoute
  ) {}
  public clubdetails:any
  public param: any;

  selectedFile: any | File = null;
  selectedFile2: any | File = null;
   public image: any = '';
  public posts: any[];
  selectedImage: string = '';
  selectedText: string = '';
  public count: number = 0
  public leader:boolean=false;
  ngOnInit() {
    this._route.params.subscribe(params => {
      this.param = params['id'];
    });
  
this.processData()
    // Retrieve saved data from local storage
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
  this._clubService.getClubDetails(this.param)
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



  processData() {
    if (this.param) {
      this.getPost();
      this.getDetails();
    }
  }

}
