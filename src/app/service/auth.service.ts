import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly url=environment.apiUrl //backend url

  constructor(private http:HttpClient) { }
   
authentication(params:string){ //user authentication of a specied club
  return this.http.get(`${this.url}/club/roleAuthentication/`+params, { withCredentials: true })
  .pipe(map((data) => data));
}

active(){ //user authentication
  return this.http.get(`${this.url}/user`, { withCredentials: true })
}

socialLogin(data:any){ //social login of a user
  return this.http.post(`${this.url}/gmail/register`,data,{ withCredentials: true })
}

login(data:any){ //login of a user
  return this.http.post(`${this.url}/login`,data,{ withCredentials: true })
}

userRegister(data:any){ //user registration
  return this.http.post(`${this.url}/register`,data,{ withCredentials: true })
}

userProfilePicture(data:any){ //user profile picture updation
  return this.http.post(`${this.url}/profile-upload-single`,data,{ withCredentials: true })
}

profileEdit(data:any){ //user profile edit
  return this.http.post(`${this.url}/update/profile`,data,{ withCredentials: true })
}

profileJoinClub(data:any){ //joining to a club from user's profile
  return this.http.post(`${this.url}/profile/join/club`,data,{ withCredentials: true })
}

changePassword(data:any){ //change password of a user
  return this.http.post(`${this.url}/changePassword`,data,{ withCredentials: true })
}


leaveFromClub(id:string){ //To leave from club
  return this.http.get(`${this.url}/leaveClub/`+id,{ withCredentials: true})  
}

logout(){ //user logout
  return this.http.post(`${this.url}/logout`,{},{ withCredentials: true })
}


}
