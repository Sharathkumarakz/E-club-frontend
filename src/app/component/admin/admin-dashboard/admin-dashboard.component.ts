
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

  public dashboard:any;
  constructor(
    private _adminService: AdminServiceService,
    private router: Router
  ) { }

  ngOnInit() {
    this._adminService.active().subscribe((response: any) => {
      Emitters.authEmiter.emit(true)
    }, (err) => {
      this.router.navigate(['/admin']);
      Emitters.authEmiter.emit(false)
    })

    this._adminService.getDashboard().subscribe((response:any)=>{
      this.dashboard = response
    }, (err) => {
        console.log(err);       
    })
  }


  logout(): void {
    this._adminService.logout().subscribe(() => {
      this.router.navigate(['/admin']);
    });
  }
}