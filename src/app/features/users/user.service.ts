import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserDto } from './models/user-dto.model';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = `${environment.apis.default.url}/api`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  addUserSubject = new Subject<UserDto>();
  //removeUserSubject = new Subject<UserDto>();
  //currentUser = this.addUserSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  addUser(userDto: UserDto) {
    this.addUserSubject.next(userDto);
  }

  // removeUser(userDto: UserDto) {
  //   this.removeUserSubject.next(userDto);
  // }

  // Show lists of item
  list(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/user`)
      .pipe(catchError(this.handleError));
  }

  // Create new item
  getItem(id: any): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/user/${id}`)
      .pipe(catchError(this.handleError));
  }

  //'https://localhost:7213/api/user-information/paged?pageNumber=1&pageSize=10'
  getAll(pagedAndSortedDto: PagedAndSortedDto): Observable<any> {
    var params = new HttpParams();
    params = params.set('pageNumber', pagedAndSortedDto.pageNumber);
    params = params.set('pageSize', pagedAndSortedDto.pageSize);
    //params = params.set('filter', pagedAndSortedDto.filter);
    return this.httpClient
      .get(`${this.apiUrl}/user/paged`, { params })
      .pipe(catchError(this.handleError));
  }

  // getAll(pagedAndSortedDto: PagedAndSortedDto): Observable<any> {
  //   var params = new HttpParams();
  //   params = params.set('skipCount', pagedAndSortedDto.skipCount);
  //   params = params.set('maxResultCount', pagedAndSortedDto.maxResultCount);
  //   params = params.set('filter', pagedAndSortedDto.filter);
  //   return this.httpClient.get(`${this.apiUrl}/user-information/GetPagedAndSortedResult`, {params}).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  create(data: any): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/user`, data)
      .pipe(catchError(this.handleError));
  }

  // Edit/ Update
  update(id: any, data: any): Observable<any> {
    return this.httpClient
      .put(`${this.apiUrl}/user/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Delete
  delete(id: any): Observable<any> {
    return this.httpClient
      .delete(`${this.apiUrl}/user/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Get count
  getCount(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/user/count`)
      .pipe(catchError(this.handleError));
  }

  // Search By Name
  filterByTitle(title: any): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}?title_like=${title}`)
      .pipe(catchError(this.handleError));
  }

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
