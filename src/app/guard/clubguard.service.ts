// import { Injectable, } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { AuthService } from '../service/auth.service';
// import { SharedService } from 'src/app/shared-service.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class ClubguardService implements CanActivate {
//   public id: string = '';
//   public param: any = '';

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {
    
//     const storedData = localStorage.getItem('myData');
//     if (storedData) {
//       this.param = JSON.parse(storedData);
//     }
//   }


// async canActivate(
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ): Promise<boolean | UrlTree> {
//   if (!this.param) {
//     console.log("notttttttttt");
    
//     this.router.navigate(['/']);
//     return false;
//   } else {
//     try {
//       const response: any = await this.authService.authentication(this.param).toPromise();

//       if (response.authenticated) {
//         console.log("reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        
//         return true;
//       } else {
//         this.router.navigate(['/']);
//         return false;
//       }
//     } catch (error) {
//       console.error('An error occurred during authentication:', error);
//     this.router.navigate(['/']);

//       return false;
//     }
//   }
// }
// }

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClubguardService implements CanActivate {
  public id: string = '';
  public param: any = '';

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
      console.log("Not authenticated");
      this.router.navigate(['/']);
      return false;
    } else {
      try {
        const response: any = await this.authService.authentication(this.param).toPromise();

        if (response.authenticated) {
          console.log("Authenticated");
          return true;
        } else {
          console.log("Not authenticated");
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
