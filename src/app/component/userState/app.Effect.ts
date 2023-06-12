import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {  retrieveprofile, retrieveprofileSucces } from "./appAction";
import { map, switchMap } from "rxjs";
import { appUserService } from "./appUser.Service";
import { Profile} from "./models";

@Injectable()
export class appEffects{
    constructor(private actions$:Actions,private appServie:appUserService){}
    loadProfile$=createEffect(()=>
    this.actions$.pipe(
     ofType(retrieveprofile),
     switchMap(()=>{
      console.log("eeeeeeeeeeeeeeeeeeeeefctttttttt");
        return this.appServie.loadProfile()
        .pipe(map((data)=>retrieveprofileSucces({userdetails:data as Profile })
      ))
         
     })
    )
    )
}