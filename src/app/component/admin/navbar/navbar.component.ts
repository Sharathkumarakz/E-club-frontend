import { Component } from '@angular/core';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
constructor(
  private _adminService: AdminServiceService,
  private _router:Router
  ){}
  
  logout(): void {
      localStorage.removeItem('EClubAdmin')
       this._router.navigate(['/admin']);
    }
    
}
