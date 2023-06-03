import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  constructor( private http: HttpClient,
    private router: Router) { }
  ngOnInit() {
  this.http.get('http://localhost:5000/admin/active', {
    withCredentials: true
  }).subscribe((response: any) => {
    Emitters.authEmiter.emit(true)
  }, (err) => {
    this.router.navigate(['/admin']);
    Emitters.authEmiter.emit(false)
  })
}

logout(): void {
  this.http.post('http://localhost:5000/admin/logout', {}, {
    withCredentials: true
  }).subscribe(() => {
   this.router.navigate(['/admin']);
  });
}
}