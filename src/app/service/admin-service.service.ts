import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AdminServiceService {

  private readonly url = environment.apiUrl

  constructor(private _http: HttpClient) { }

  //CHECK ADMIN ACTIVE OR NOT
  active() {
    return this._http.get(`${this.url}/admin/active`, { withCredentials: true })
  }

  //ADMIN LOGIN
  login(data: any) {
    return this._http.post(`${this.url}/admin/login`, data, { withCredentials: true })
  }


  //ADD CLUB TO BLACKLIST
  addToBlacklisted(param: string) {
    return this._http.post(`${this.url}/admin/club/addToBlacklist/` + param, { withCredentials: true })
      .pipe(map((data) => data));
  }

  //GET BLACKLISTED CLUBS
  getBlacklisted() {
    return this._http.get(`${this.url}/admin/club/blacklisted`, { withCredentials: true })
      .pipe(map((data) => data));
  }

  //REMOVE CLUB FROM BLACKLIST
  removeBlacklisted(param: string) {
    return this._http.post(`${this.url}/admin/club/removeBlacklist/` + param, { withCredentials: true })
      .pipe(map((data) => data));
  }

  //GET ALL CLUBS
  getClubs() {
    return this._http.get(`${this.url}/admin/club`, { withCredentials: true })
  }

  //GET ALL USERS
  getUsers() {
    return this._http.get(`${this.url}/admin/users`, { withCredentials: true })
  }

  //BLOCK USER
  blockUser(param: string) {
    return this._http.post(`${this.url}/admin/user/block/` + param, { withCredentials: true })
      .pipe(map((data) => data));
  }

  //UNBLOCK USER
  unBlockUser(param: string) {
    return this._http.post(`${this.url}/admin/user/unBlock/` + param, { withCredentials: true })
      .pipe(map((data) => data));
  }

  //GET DETAILS OF SPECIFIED CLUB 
  getClubDetails(param: string) {
    return this._http.get(`${this.url}/admin/clubDetails/` + param, { withCredentials: true })

  }

  //ADD BANNER
  addBanner(data: any) {
    return this._http.post(`${this.url}/admin/addBanner`, data, { withCredentials: true })
  }

  //GET BANNER
  getBanner() {
    return this._http.get(`${this.url}/admin/banners`, { withCredentials: true })

  }

  //DELETE BANNER
  deleteBanner(data: any) {
    return this._http.post(`${this.url}/admin/deleteBanner`, data, { withCredentials: true })
  }

  //GET DASHBOARD DATA ,RETURNING CLUBS COUNT & USERS COUNT
  getDashboard() {
    return this._http.get(`${this.url}/admin/dashboard`, { withCredentials: true })

  }
  //ADMIN LOGOUT
  logout() {
    return this._http.post(`${this.url}/admin/logout`, {}, { withCredentials: true })
  }
}
