import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
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

  // public methods
  // login(email: string, password: string): Observable<any> {
  //   return this.http.post<AuthUserDto>(`${API_USERS_URL}/login`, {
  //     email,
  //     password,
  //   });
  // }

  login(email: string, password: string): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/login`, { email, password })
      .pipe(catchError(this.handleError));
  }

  // CREATE =>  POST: add a new user to the server
  registerUser(data: RegisterModel): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/registration`, data);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  getUserByToken(token: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/me`, {token})
      .pipe(catchError(this.handleError));
  }

  // getUserByToken(token: string): Observable<UserModel> {
  //   const httpHeaders = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.httpClient.get<UserModel>(`${API_USERS_URL}/me`, {
  //     headers: httpHeaders,
  //   });
  // }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
