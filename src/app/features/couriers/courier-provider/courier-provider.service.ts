import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { environment } from 'src/environments/environment';
import { CourierProviderDto } from './models/courier-provider-dto';

@Injectable({
  providedIn: 'root',
})
export class CourierProviderService {
  apiUrl: string = `${environment.apis.default.url}/api`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  addCourierProviderSubject = new Subject<CourierProviderDto>();
  //removeCourierProviderSubject = new Subject<CourierProviderDto>();
  //currentCourierProvider = this.addCourierProviderSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  addCourierProvider(courierProviderDto: CourierProviderDto) {
    this.addCourierProviderSubject.next(courierProviderDto);
  }

  // removeCourierProvider(courierProviderDto: CourierProviderDto) {
  //   this.removeCourierProviderSubject.next(courierProviderDto);
  // }

  // Show lists of item
  list(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/courier-provider`)
      .pipe(catchError(this.handleError));
  }

  // Create new item
  getById(id: any): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/courier-provider/${id}`)
      .pipe(catchError(this.handleError));
  }

  getAll(pagedAndSortedDto: PagedAndSortedDto): Observable<any> {
    var params = new HttpParams();
    var params = new HttpParams();
    params = params.set('pageNumber', pagedAndSortedDto.pageNumber);
    params = params.set('pageSize', pagedAndSortedDto.pageSize);
    params = params.set('sortBy', pagedAndSortedDto.sortBy);
    params = params.set('sortOrder', pagedAndSortedDto.sortOrder);
    params = params.set('filter', pagedAndSortedDto.filter);
    
    return this.httpClient
      .get(`${this.apiUrl}/courier-provider/paged`, { params })
      .pipe(catchError(this.handleError));
  }

  create(data: any): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/courier-provider`, data)
      .pipe(catchError(this.handleError));
  }

  // Edit/ Update
  update(id: any, data: any): Observable<any> {
    return this.httpClient
      .put(`${this.apiUrl}/courier-provider/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Delete
  delete(id: any): Observable<any> {
    return this.httpClient
      .delete(`${this.apiUrl}/courier-provider/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Get count
  getCount(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/courier-provider/count`)
      .pipe(catchError(this.handleError));
  }

  // Get Dropdown
  getDropdown(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/courier-provider/dropdown`)
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
