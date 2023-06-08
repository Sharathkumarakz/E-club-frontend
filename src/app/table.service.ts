import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TableService {
  private baseUrl='http://localhost:5000/club/members/:id'
  constructor() { }
}
