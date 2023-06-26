import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly url=environment.apiUrl
  constructor(private http:HttpClient) { }
   
authentication(params:string){
  return this.http.get(`${this.url}/club/roleAuthentication/`+params, { withCredentials: true })
  .pipe(map((data) => data));
}

active(){
  return this.http.get(`${this.url}/user`, { withCredentials: true })
}

socialLogin(data:any){
  return this.http.post(`${this.url}/gmail/register`,data,{ withCredentials: true })
}

login(data:any){
  return this.http.post(`${this.url}/login`,data,{ withCredentials: true })
}

logout(){
  return this.http.post(`${this.url}/logout`,{},{ withCredentials: true })

}

userProfilePicture(data:any){
  return this.http.post(`${this.url}/profile-upload-single`,data,{ withCredentials: true })
}

profileEdit(data:any){
  return this.http.post(`${this.url}/update/profile`,data,{ withCredentials: true })
}

profileJoinClub(data:any){
  return this.http.post(`${this.url}/profile/join/club`,data,{ withCredentials: true })
}

userRegister(data:any){
  return this.http.post(`${this.url}/register`,data,{ withCredentials: true })
}


changePass(data:any){
  return this.http.post(`${this.url}/changePassword`,data,{ withCredentials: true })
}



}
