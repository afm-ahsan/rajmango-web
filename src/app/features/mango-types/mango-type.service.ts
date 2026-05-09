import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MangoTypeService {
  apiUrl: string = `${environment.apis.default.url}/api`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) { }

  // Show lists of item
  list(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/mango-type`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new item
  getOne(id: any): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/mango-type/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  //'https://localhost:7213/api/mango-type-information/paged?pageNumber=1&pageSize=10'
  getAll(pagedAndSortedDto: PagedAndSortedDto): Observable<any> {
    var params = new HttpParams();
    params = params.set('pageNumber', pagedAndSortedDto.pageNumber);
    params = params.set('pageSize', pagedAndSortedDto.pageSize);
    params = params.set('sortBy', pagedAndSortedDto.sortBy);
    params = params.set('sortOrder', pagedAndSortedDto.sortOrder);
    params = params.set('filter', pagedAndSortedDto.filter);
    
    return this.httpClient.get(`${this.apiUrl}/mango-type/paged`, {params}).pipe(
      catchError(this.handleError)
    );
  }

  // getAll(pagedAndSortedDto: PagedAndSortedDto): Observable<any> {
  //   var params = new HttpParams();
  //   params = params.set('skipCount', pagedAndSortedDto.skipCount);
  //   params = params.set('maxResultCount', pagedAndSortedDto.maxResultCount);
  //   params = params.set('filter', pagedAndSortedDto.filter);
  //   return this.httpClient.get(`${this.apiUrl}/mango-type-information/GetPagedAndSortedResult`, {params}).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  create(data: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/mango-type`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Edit/ Update
  update(id: any, data: any): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/mango-type/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Delete
  delete(id: any): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/mango-type/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Search By Name
  filterByTitle(title: any): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}?title_like=${title}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get count
  getCount(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/mango-type/count`)
      .pipe(catchError(this.handleError));
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };

}
