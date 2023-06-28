
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {map} from 'rxjs/operators'
import { environment } from "src/environments/environment";
@Injectable()
export class appUserService{
    constructor(private http:HttpClient){}

    loadProfile(){
      return this.http.get(`${environment.apiUrl}/profile`,{withCredentials:true})
        }
}
