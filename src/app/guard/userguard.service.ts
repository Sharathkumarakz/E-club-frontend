import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserguardService implements CanActivate {

constructor(private authService:AuthService,private router:Router){}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {

      try {
        const response: any = await this.authService.active().toPromise();
        if (response) {
          console.log(true);
          return true;
        } else {
          this.router.navigate(['/']); 
          return false;
        }
      } catch (error) {
        console.error('An error occurred during authentication:', error);
      this.router.navigate(['/']);
  
        return false;
      }
    }
  }
  
