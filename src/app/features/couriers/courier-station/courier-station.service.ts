import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { environment } from 'src/environments/environment';
import { CourierStationDto } from './models/courier-station-dto';

@Injectable({
  providedIn: 'root',
})
export class CourierStationService {
  apiUrl: string = `${environment.apis.default.url}/api`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  addCourierStationSubject = new Subject<CourierStationDto>();
  //removeCourierStationSubject = new Subject<CourierStationDto>();
  //currentCourierStation = this.addCourierStationSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  addCourierStation(courierStationDto: CourierStationDto) {
    this.addCourierStationSubject.next(courierStationDto);
  }

  // removeCourierStation(courierStationDto: CourierStationDto) {
  //   this.removeCourierStationSubject.next(courierStationDto);
  // }

  // Show lists of item
  list(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/courier-station`)
      .pipe(catchError(this.handleError));
  }

  // Create new item
  getById(id: any): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/courier-station/${id}`)
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
      .get(`${this.apiUrl}/courier-station/paged`, { params })
      .pipe(catchError(this.handleError));
  }

  create(data: any): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/courier-station`, data)
      .pipe(catchError(this.handleError));
  }

  // Edit/ Update
  update(id: any, data: any): Observable<any> {
    return this.httpClient
      .put(`${this.apiUrl}/courier-station/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Delete
  delete(id: any): Observable<any> {
    return this.httpClient
      .delete(`${this.apiUrl}/courier-station/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Get count
  getCount(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/courier-station/count`)
      .pipe(catchError(this.handleError));
  }

  // Get Dropdown
  getDropdown(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/courier-station/dropdown`)
      .pipe(catchError(this.handleError));
  }

  // Get Available Couriers
  getAvailableCouriers(area: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/courier-station/available?area=${area}`)
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
