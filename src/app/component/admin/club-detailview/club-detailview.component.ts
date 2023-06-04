import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-club-detailview',
  templateUrl: './club-detailview.component.html',
  styleUrls: ['./club-detailview.component.css']
})
export class ClubDetailviewComponent implements OnInit {
  constructor( private http: HttpClient,
    private router: Router,private route: ActivatedRoute) { }
  public param:any
  public about:any
  public name: any = '';
  public place: any = '';
  public registerNo: any = '';
  public category: any = '';
  public image: any = '';
  public posts: any[];
  public leaders:any
  public members:any

  selectedImage: string = '';
  selectedText: string = '';

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.param = params['id'];
    });

  this.http.get('http://localhost:5000/admin/active', {
    withCredentials: true
  }).subscribe((response: any) => {
    Emitters.authEmiter.emit(true)
  }, (err) => {
    this.router.navigate(['/admin']);
    Emitters.authEmiter.emit(false)
  })
  
  this.getClub();
  this.getPost();
  this.getLeaders();
   this.getMembers()
}
getClub() {
  this.http.get('http://localhost:5000/club/' + this.param, {
    withCredentials: true
  }).subscribe((response: any) => {
    this.name = response.data.clubName;
    this.place = response.data.place;
    this.registerNo = response.data.registerNo;
    this.category = response.data.category;
    this.image = response.data.image;
    this.about = response.data.about;
    Emitters.authEmiter.emit(true);
  }, (err) => {
    this.router.navigate(['/']);
  });

}

selectItem(imageUrl: string, text: string) {
  this.selectedImage = imageUrl;
  this.selectedText = text;
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

getLeaders() {
  this.http.get('http://localhost:5000/admin/club/leaders/' + this.param, {
    withCredentials: true
  }).subscribe((response: any) => {
    this.leaders = response;
    console.log(response);
    
    Emitters.authEmiter.emit(true);
  }, (err) => {
    this.router.navigate(['/']);
  });
}

getMembers(){
  this.http.get('http://localhost:5000/admin/club/members/' + this.param, {
    withCredentials: true
  }).subscribe((response: any) => {
    this.members = response;
    console.log(response);   
    Emitters.authEmiter.emit(true);
  }, (err) => {
    this.router.navigate(['/']);
  }); 
}


logout(): void {
  this.http.post('http://localhost:5000/admin/logout', {}, {
    withCredentials: true
  }).subscribe(() => {
   this.router.navigate(['/admin']);
  });
}
}