import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  private readonly url=environment.apiUrl
  constructor(private http:HttpClient) { }
  active(){
    return this.http.get(`${this.url}/admin/active`, { withCredentials: true })
  }
  
  login(data:any){
    return this.http.post(`${this.url}/admin/login`,data,{ withCredentials: true })
  }


  logout(){
    return this.http.post(`${this.url}/admin/logout`,{},{ withCredentials: true }) 
  }

  getBlacklisted(){
    return this.http.get(`${this.url}/admin/club/blacklisted`,{ withCredentials: true })
    .pipe(map((data) => data)); 
  }

  removeBlacklisted(param:string){
    return this.http.post(`${this.url}/admin/club/removeBlacklist/`+param,{ withCredentials: true })
    .pipe(map((data) => data)); 
  }
  
  getClubs(){
    return this.http.get(`${this.url}/admin/club`,{ withCredentials: true })   
  }
  

  addToBlacklisted(param:string){
    return this.http.post(`${this.url}/admin/club/addToBlacklist/`+param,{ withCredentials: true })
    .pipe(map((data) => data)); 
  }

  getUsers(){
    return this.http.get(`${this.url}/admin/users`,{ withCredentials: true })   
  }
  

  blockUser(param:string){
    return this.http.post(`${this.url}/admin/user/block/`+param,{ withCredentials: true })
    .pipe(map((data) => data)); 
  }

  unBlockUser(param:string){
    return this.http.post(`${this.url}/admin/user/unBlock/`+param,{ withCredentials: true })
    .pipe(map((data) => data)); 
  }
}
