import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AdminServiceService {

  private readonly url = environment.apiUrl //backend url

  constructor(private _http: HttpClient) { }


  active() { //admin authentication
    return this._http.get(`${this.url}/admin/active`, { withCredentials: true })
  }

  login(data: any) { //admin login
    return this._http.post(`${this.url}/admin/login`, data, { withCredentials: true })
  }

  addToBlacklisted(param: string) { //addclub to black list
    return this._http.post(`${this.url}/admin/club/addToBlacklist/` + param, { withCredentials: true })
      .pipe(map((data) => data));
  }

  getBlacklisted() { //get all blacklisted clubs
    return this._http.get(`${this.url}/admin/club/blacklisted`, { withCredentials: true })
      .pipe(map((data) => data));
  }

  removeBlacklisted(param: string) { //remove club from blacklist
    return this._http.post(`${this.url}/admin/club/removeBlacklist/` + param, { withCredentials: true })
      .pipe(map((data) => data));
  }

  getClubs() { //get all clubs for listing
    return this._http.get(`${this.url}/admin/club`, { withCredentials: true })
  }

  getUsers() { //get all users for listing
    return this._http.get(`${this.url}/admin/users`, { withCredentials: true })
  }

  blockUser(param: string) { //block user
    return this._http.post(`${this.url}/admin/user/block/` + param, { withCredentials: true })
      .pipe(map((data) => data));
  }

  unBlockUser(param: string) { //unblock user
    return this._http.post(`${this.url}/admin/user/unBlock/` + param, { withCredentials: true })
      .pipe(map((data) => data));
  }

  getClubDetails(param: string) { //get details of a specified club
    return this._http.get(`${this.url}/admin/clubDetails/` + param, { withCredentials: true })
  }

  addBanner(data: any) { //add banner
    return this._http.post(`${this.url}/admin/addBanner`, data, { withCredentials: true })
  }

  getBanner() { //get all banners
    return this._http.get(`${this.url}/admin/banners`, { withCredentials: true })
  }

  deleteBanner(data: any) { //delete banner
    return this._http.post(`${this.url}/admin/deleteBanner`, data, { withCredentials: true })
  }

  getDashboard() { //get dashboard data,returning clubs(count) and users(count)
    return this._http.get(`${this.url}/admin/dashboard`, { withCredentials: true })

  }

  logout() { //admin logout
    return this._http.post(`${this.url}/admin/logout`, {}, { withCredentials: true })
  }





}
