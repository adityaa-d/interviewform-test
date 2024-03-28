import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://192.168.1.80:9134/api/Data';

  save(data: any) {
    return this.http.post(`${this.apiUrl}/Save/`, data);
  }

  update(id:any,data: any) {
    return this.http.post(`${this.apiUrl}/Save/`, data);
  }

  delete(data: any) {
    return this.http.post(`${this.apiUrl}/Delete`, data);
  }

  fetch() {
   
    return this.http.get(`${this.apiUrl}/Fetch`);
  }
}
