
import { Injectable,Injector } from '@angular/core';
import { HttpInterceptor } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorInterceptor implements HttpInterceptor {
  // constructor(private injector :Injector) { }
  intercept(req:any,next:any){
    let token=localStorage.getItem('userToken');
 if(token){
  let tokenizedReq=req.clone({
    setHeaders:{
      Authorization: token
     }
  })
  return next.handle(tokenizedReq)
}
  
let tokenizedReq=req.clone({
  setHeaders:{
    Authorization: ''
   }
})
return next.handle(tokenizedReq)
}
}


