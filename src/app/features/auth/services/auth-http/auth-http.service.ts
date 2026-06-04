import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { environment_demo } from '../../../../../environments/environment.demo';
import { RegisterModel } from '../../models/register.model';

const API_USERS_URL = `${environment_demo.apiUrl}/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
  apiUrl: string = `${environment.apis.default.url}/api/auth`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/login`, { email, password });
  }

  registerUser(data: RegisterModel): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/registration`, data);
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${API_USERS_URL}/forgot-password`, { email });
  }

  getUserByToken(token: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/me`, { token });
  }
}
