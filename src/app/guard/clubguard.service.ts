import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { SharedService } from 'src/app/shared-service.service';

@Injectable({
  providedIn: 'root'
})
export class ClubguardService implements CanActivate {
  public id: string = '';
  public param: string = '';

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private router: Router
  ) {
    this.sharedService.data$.subscribe((data: any) => {
      this.param = data;
    });
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
    }
  }


async canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> {
  if (!this.param) {
    this.router.navigate(['/']);
    return false;
  } else {
    try {
      const response: any = await this.authService.authentication(this.param).toPromise();

      if (response.authenticated) {
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
}

