
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { ActivatedRoute } from '@angular/router';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { AdminServiceService } from 'src/app/service/admin-service.service';

@Component({
  selector: 'app-club-detailview',
  templateUrl: './club-detailview.component.html',
  styleUrls: ['./club-detailview.component.css']
})

export class ClubDetailviewComponent implements OnInit {

  constructor(
    private _adminService: AdminServiceService,
     private _clubService: ClubServiveService,
    private _router: Router,
     private _route: ActivatedRoute
     ) { }

  public param: string
  public about: string
  public name: string = '';
  public place: string = '';
  public registerNo: string = '';
  public category: string = '';
  public image: string = '';
  public posts: any[];
  public leaders: any
  public members: any
  public count: number = 0

  selectedImage: string = '';
  selectedText: string = '';

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.param = params['id'];
    });
    this._adminService.active().subscribe((response: any) => {
      Emitters.authEmiter.emit(true)
    }, (err) => {
      this._router.navigate(['/admin']);
      Emitters.authEmiter.emit(false)
    })
    this.getClub();
    this.getPost();
    this.getMembers()
  }
  getClub() {
    this._adminService.getClubDetails(this.param).subscribe((response: any) => {
      this.name = response.data.clubName;
      this.place = response.data.address;
      this.registerNo = response.data.registerNo;
      this.category = response.data.category;
      this.image = response.data.image;
      this.about = response.data.about;
      this.count = response.data.members.length + 3
      this.leaders = response.data
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this._router.navigate(['/']);
    });
  }

  selectItem(imageUrl: string, text: string) {
    this.selectedImage = imageUrl;
    this.selectedText = text;
  }

  
  getPost() {
    this._clubService.getPost(this.param).subscribe((posts: any) => {
      this.posts = posts;
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this._router.navigate(['/']);
    });
  }


  getMembers() {
    this._clubService.getMembers(this.param).subscribe((response: any) => {
      this.members = response;
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this._router.navigate(['/']);
    });
  }

}