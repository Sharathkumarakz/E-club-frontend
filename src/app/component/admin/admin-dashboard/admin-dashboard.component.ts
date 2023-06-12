import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { AdminServiceService } from 'src/app/service/admin-service.service';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  constructor( private http: HttpClient,private adminService:AdminServiceService,
    private router: Router) { }
  ngOnInit() {
this.adminService.active().subscribe((response: any) => {
    Emitters.authEmiter.emit(true)
  }, (err) => {
    this.router.navigate(['/admin']);
    Emitters.authEmiter.emit(false)
  })
}

logout(): void {
this.adminService.logout().subscribe(() => {
   this.router.navigate(['/admin']);
  });
}
}