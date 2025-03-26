import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // apiUrl = 'https://localhost:3000/api/login';

  constructor(private http:HttpClient) { }

  private apiUrl = 'http://localhost:3000'; // Replace with actual backend URL

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  } 


  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }


  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
    
    
    
}
