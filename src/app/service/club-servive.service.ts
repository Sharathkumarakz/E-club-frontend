import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ClubServiveService {

private readonly url=environment.apiUrl  //backend url

constructor(private http:HttpClient) { }

  private valueSubject = new Subject<string>();
  value$ = this.valueSubject.asObservable();
  

  getClubData(param: string){ //getting a specified clubs data
    return this.http.get(`${this.url}/club/`+param, { withCredentials: true })
    .pipe(map((data) => data));
  }

  getClubDetails(param: string){ //getting a specified clubs data as search result
    return this.http.get(`${this.url}/clubdetails/`+param, { withCredentials: true })
    .pipe(map((data) => data));
  }
 

  getEvents(param: string) { //getting events of a specified club
    return this.http.get(`${this.url}/club/events/`+param, { withCredentials: true })
      .pipe(map((data) => data));
  }

  addEvents(param: string,data:any){ //add event to a specific club
    return this.http.post(`${this.url}/club/addEvent/`+param,data, { withCredentials: true })
  }
  
  deleteEvent(param: string,data:any){ //delete event from specific club
    return this.http.post(`${this.url}/club/deleteEvent/`+param,data, { withCredentials: true })
  }

  getPost(param:string){ //getting posts of a specific club
    return this.http.get(`${this.url}/club/posts/`+param,{ withCredentials: true })
    .pipe(map((data) => data));
  }
  
  clubProfilePictureUpdate(param: string,data: any) { //club profile-picture updation
    return this.http.post(`${this.url}/club/pictureUpdate/`+param,data, { withCredentials: true })
  }

  addPost(param: string,data: any) { //add post of a specific club 
    return this.http.post(`${this.url}/club/addPost/`+param,data,{ withCredentials: true})
  }

  deletePost(param:string) { //delete a specific post of club
    return this.http.post(`${this.url}/club/deletePost/`+param,{ withCredentials: true}) 
  }

  addFinancialData(param:string,data:string) { //finacial data adding by treasurer
    return this.http.post(`${this.url}/update/finance/`+param,data,{ withCredentials: true}) 
}

getFinancialDataIncome(param:string) { //getting income of a specific club
  return this.http.get(`${this.url}/club/financeIncome/`+param,{ withCredentials: true}) 
}

getFinancialDataLoss(param:string) { //getting loss of a specific club
  return this.http.get(`${this.url}/club/financeLoss/`+param,{ withCredentials: true}) 
}

setStripeId(param:string,data:any) { //setting stripe id for each club by treasurers
  return this.http.post(`${this.url}/club/stripe/`+param,data,{ withCredentials: true}) 
}

joinClub(data:any) { //joining to a club with its credentials
  return this.http.post(`${this.url}/join/club`,data,{ withCredentials: true}) 
}

addMember(param:string,data:any) { //add member toa specified club
  return this.http.post(`${this.url}/club/addMember/`+param,data,{ withCredentials: true}) 
}

getMembers(param:string){ //getting members list of a specified club
  return this.http.get(`${this.url}/club/memberslist/`+param,{ withCredentials: true})
  .pipe(map((data) => data));
}

removeMember(data:any){ //removing a member from club
  return this.http.post(`${this.url}/club/deleteMember`,data,{ withCredentials: true})
}

addNotification(param:string,data:any){ //sending notification by president(role) or secretory(role)
  return this.http.post(`${this.url}/club/notifications/`+param,data,{ withCredentials: true})
}

getNotification(param:string){ //getting notifications of a specified club
  return this.http.get(`${this.url}/club/getNotifications/`+param,{ withCredentials: true})
  .pipe(map((data) => data));
}

makePayment(param:string,data:any){ //payment making with stipe
  return this.http.post(`${this.url}/club/checkout/`+param,data,{ withCredentials: true})
}

paymentReceipt(param:string){ //payment receipt data getting
  return this.http.get(`${this.url}/user/payment/`+param,{ withCredentials: true})
}

getJoinedClubs(){ //getting all joined club of a user to show in profile
  return this.http.get(`${this.url}/user/clubs`,{ withCredentials: true})  
}

registerClub(data:any){ //registering a new club
  return this.http.post(`${this.url}/register/club`,data,{ withCredentials: true})
}

editClubProfile(params:string,data:any){ //edit club profile details
  return this.http.post(`${this.url}/club/editClubProfile/`+params,data,{ withCredentials: true})
}


securityUpdate(params:string,data:any){ //club security code updation
  return this.http.post(`${this.url}/club/updateSecurityCode/`+params,data,{ withCredentials: true})
}

changeCommitee(params:string,data:any){ //club commitee cahnging
  return this.http.post(`${this.url}/club/updateCommitee/`+params,data,{ withCredentials: true})
}

Conference(params:string,data:any){ //conference link sharing 
  return this.http.post(`${this.url}/club/conference/`+params,data,{ withCredentials: true})
}

removeConference(param:string){ //remove conference link
  return this.http.get(`${this.url}/club/conference/`+param,{ withCredentials: true})  
}

getAllClubs(name:any){ //getting all clubs (search list)
  return this.http.post(`${this.url}/clubs`,{name},{ withCredentials: true})  
}




updateValue(value: string) {
  this.valueSubject.next(value);
}

}
