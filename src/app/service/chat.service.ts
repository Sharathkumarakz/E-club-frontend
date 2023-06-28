import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as socketIOClient from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private clientSocket: socketIOClient.Socket;

  constructor(private http:HttpClient,) {
    this.clientSocket = socketIOClient.connect(environment.apiUrl);
  }



  joinRoom(data:any){
  this.clientSocket.emit('join',data)
  this.http.post(`${environment.apiUrl}/club/chatJoin/${data.room}`,data, { withCredentials: true }).subscribe();
  }


  newUserJoined(){
    let observable=new Observable<{user:any,message:String,time:any,room:String}>(observer=>{
      this.clientSocket.on('newUserJoined',(data)=>{
        observer.next(data)
      })
      return ()=>{this.clientSocket.disconnect();}
    })
    return observable;
  }



  leaveRoom(data: any){
    this.clientSocket.emit('leave',data)
  this.http.post(`${environment.apiUrl}/club/leaveChat/${data.room}`,data, { withCredentials: true }).subscribe();

  }

  userLeftRoom(){
    let observable=new Observable<{user:any,message:String,time:any,room:String}>(observer=>{
      this.clientSocket.on('leftRoom',(data)=>{
        observer.next(data)
      })
      return ()=>{this.clientSocket.disconnect();}
    })
    return observable;  
  }


  sendMessage(data: any): void {
    this.clientSocket.emit('message', data);
    this.http.post(`${environment.apiUrl}/club/chat/${data.room}`,data, { withCredentials: true }).subscribe();
    
  }
  


  newMessageReceived(): Observable<any> {
    return new Observable<any>(observer => {
      this.clientSocket.on('newMessage', (data) => {
        observer.next(data);
      });
      return () => {
        this.clientSocket.disconnect();
      };
    });
  }


  getOldMessages(id: string): Observable<{ user:any, message: string, time: any, room: string }[]> {
    return this.http.get<{ user: string, message: string, time:any, room: string }[]>(`${environment.apiUrl}/club/chat/${id}`, { withCredentials: true });
  }

  getActiveMembers(id: string){
    return this.http.get(`${environment.apiUrl}/club/chatJoin/${id}`, { withCredentials: true });
  }

}
