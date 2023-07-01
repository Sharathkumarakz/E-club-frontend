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
    this.clientSocket = socketIOClient.connect(environment.apiUrl); //socket connection 
  }

  joinRoom(data:any){ //joining to a room for group chat
  this.clientSocket.emit('join',data)
  this.http.post(`${environment.apiUrl}/club/chatJoin/${data.room}`,data, { withCredentials: true }).subscribe();
  }

  newUserJoined(){ //getting data of new user joined to a chat room
    let observable=new Observable<{user:any,message:String,time:any,room:String}>(observer=>{
      this.clientSocket.on('newUserJoined',(data)=>{
        observer.next(data)
      })
      return ()=>{this.clientSocket.disconnect();}
    })
    return observable;
  }

  leaveRoom(data: any){ //leaving a chat room
    this.clientSocket.emit('leave',data)
  this.http.post(`${environment.apiUrl}/club/leaveChat/${data.room}`,data, { withCredentials: true }).subscribe();
  }

  userLeftRoom(){ //getting data of a user leaving chat room
    let observable=new Observable<{user:any,message:String,time:any,room:String}>(observer=>{
      this.clientSocket.on('leftRoom',(data)=>{
        observer.next(data)
      })
      return ()=>{this.clientSocket.disconnect();}
    })
    return observable;  
  }

  sendMessage(data: any): void { //storing and emiting sending messages
    this.clientSocket.emit('message', data);
    this.http.post(`${environment.apiUrl}/club/chat/${data.room}`,data, { withCredentials: true }).subscribe(); 
  }
  
  newMessageReceived(): Observable<any> { //getting newly received message
    return new Observable<any>(observer => {
      this.clientSocket.on('newMessage', (data) => {
        observer.next(data);
      });
      return () => {
        this.clientSocket.disconnect();
      };
    });
  }

  getOldMessages(id: string): Observable<{ user:any, message: string, time: any, room: string }[]> { //getting mesages history of a club
    return this.http.get<{ user: string, message: string, time:any, room: string }[]>(`${environment.apiUrl}/club/chat/${id}`, { withCredentials: true });
  }

  getActiveMembers(id: string){ //getting list of ctive members of a specied club
    return this.http.get(`${environment.apiUrl}/club/chatJoin/${id}`, { withCredentials: true });
  }

}
