import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { ToastrService } from 'ngx-toastr';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { AuthService } from 'src/app/service/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-club-view',
  templateUrl: './club-view.component.html',
  styleUrls: ['./club-view.component.css']
})

export class ClubViewComponent implements OnInit {
  public id: string;
  constructor(
    private _router: Router,
    public _toastr: ToastrService,
    public _clubService: ClubServiveService,
    public _authService: AuthService,
    public _route: ActivatedRoute
  ) { }
  // public loader:boolean=true
  public clubdetails: any
  public param: string;
  public image: string = '';
  public posts: any[];
  selectedImage: string = '';
  selectedText: string = '';
  public count: number = 0
  public leader: boolean = false;
public loader=true
  ngOnInit() {
    //getting cllubId from route
    this._route.params.subscribe(params => {
      this.param = params['id'];
    });

    //processing function
    this.processData()
  }

  //selected item for post view
  selectItem(imageUrl: string, text: string) {
    this.selectedImage = imageUrl;
    this.selectedText = text;
  }

  processData() {
    if (this.param) {
      this.getPost();
      this.getDetails();
    }
  }

  //get all posts
  getPost() {
    this._clubService.getPost(this.param)
      .subscribe((response: any) => {
        this.posts = response;
        Emitters.authEmiter.emit(true);
      }, (err) => {
        this._router.navigate(['/']);
      });
  }

  //get club details
  getDetails() {
    this._clubService.getClubDetails(this.param)
      .subscribe((response: any) => {
        this.clubdetails = response.data;
        this.loader=false
        this.image = this.clubdetails.image
        if (response.data.president._id === response.user.id || response.data.president._id === response.user.id) {
          this.leader = true;
        }
        // this.loader=false
        Emitters.authEmiter.emit(true);
      }, (err) => {
        this._router.navigate(['/']);
      })
  };


}
