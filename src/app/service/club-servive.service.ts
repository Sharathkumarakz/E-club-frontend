import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ClubServiveService {
private readonly url=environment.apiUrl
  constructor(private http:HttpClient) { }
   

  getClubData(param: string){
    return this.http.get(`${this.url}/club/`+param, { withCredentials: true })
    .pipe(map((data) => data));
  }

  getEvents(param: string) {
    return this.http.get(`${this.url}/club/events/`+param, { withCredentials: true })
      .pipe(map((data) => data));
  }

  addEvents(param: string,data:any){
    return this.http.post(`${this.url}/club/addEvent/`+param,data, { withCredentials: true })
  }
  
  deleteEvent(param: string,data:any){
    return this.http.post(`${this.url}/club/deleteEvent/`+param,data, { withCredentials: true })
  }

  getPost(param:string){
    return this.http.get(`${this.url}/club/posts/`+param,{ withCredentials: true })
    .pipe(map((data) => data));
  }
  
  clubProfilePictureUpdate(param: string,data: any) {
    return this.http.post(`${this.url}/club/pictureUpdate/`+param,data, { withCredentials: true })
  }

  addPost(param: string,data: any) {
    return this.http.post(`${this.url}/club/addPost/`+param,data,{ withCredentials: true})
  }

  deletePost(param:string) {
    return this.http.post(`${this.url}/club/deletePost/`+param,{ withCredentials: true}) 
  }

  addFinancialData(param:string,data:string) {
    return this.http.post(`${this.url}/update/finance/`+param,data,{ withCredentials: true}) 
}

getFinancialData(param:string) {
  return this.http.get(`${this.url}/club/finance/`+param,{ withCredentials: true}) 
}

setStripeId(param:string,data:any) {
  return this.http.post(`${this.url}/club/stripe/`+param,data,{ withCredentials: true}) 
}

joinClub(data:any) {
  return this.http.post(`${this.url}/join/club`,data,{ withCredentials: true}) 
}

addMember(param:string,data:any) {
  return this.http.post(`${this.url}/club/addMember/`+param,data,{ withCredentials: true}) 
}


getMembers(param:string){
  return this.http.get(`${this.url}/club/memberslist/`+param,{ withCredentials: true})
  .pipe(map((data) => data));
}


removeMember(data:any){
  return this.http.post(`${this.url}/club/deleteMember`,data,{ withCredentials: true})
}

addNotification(param:string,data:any){
  return this.http.post(`${this.url}/club/notifications/`+param,data,{ withCredentials: true})
}

getNotification(param:string){
  return this.http.get(`${this.url}/club/getNotifications/`+param,{ withCredentials: true})
  .pipe(map((data) => data));
}

makePayment(param:string,data:any){
  return this.http.post(`${this.url}/club/checkout/`+param,data,{ withCredentials: true})
}


paymentReceipt(param:string){
  return this.http.get(`${this.url}/user/payment/`+param,{ withCredentials: true})
}


getJoinedClubs(){
  return this.http.get(`${this.url}/user/clubs`,{ withCredentials: true})  
}

registerClub(data:any){
  return this.http.post(`${this.url}/register/club`,data,{ withCredentials: true})
}


editClubProfile(params:string,data:any){
  return this.http.post(`${this.url}/club/editClubProfile/`+params,data,{ withCredentials: true})

}


securityUpdate(params:string,data:any){
  return this.http.post(`${this.url}/club/updateSecurityCode/`+params,data,{ withCredentials: true})
}

changeCommitee(params:string,data:any){
  return this.http.post(`${this.url}/club/updateCommitee/`+params,data,{ withCredentials: true})
}


}
