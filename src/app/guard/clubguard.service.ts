

//------------------------to understand a user is a part of a specified club-----------------------------

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClubguardService implements CanActivate {
  public id: string = '';
  public param: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
    }

    if (!this.param) {
      this.router.navigate(['/']);
      return false; //authentication failed
    } else {
      try {
        const response: any = await this.authService.authentication(this.param).toPromise();

        if (response.authenticated) {
          console.log("Authenticated");
          return true; //authentication pass
        } else {
          console.log("Not authenticated");
          this.router.navigate(['/']);
          return false; //authentication failed
        }
      } catch (error) {
        console.error('An error occurred during authentication:', error);
        this.router.navigate(['/']);
        return false;  //authentication failed
      }
    }
  }
}
