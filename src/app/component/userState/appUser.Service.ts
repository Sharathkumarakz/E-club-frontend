
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {map} from 'rxjs/operators'

@Injectable()
export class appUserService{
    constructor(private http:HttpClient){}

    //-----------users-
    loadProfile(){
      return this.http.get("http://localhost:5000/profile",{withCredentials:true})
      // .pipe(map((data)=>data))
        }
    //----------
}
