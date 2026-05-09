import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PagedAndSortedDto } from '../models/pagedAndSorted.model';
import { PaymentModel } from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  apiUrl: string = `${environment.apis.default.url}/api`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  addPaymentSubject = new Subject<PaymentModel>();
  //removePaymentSubject = new Subject<PaymentModel>();
  //currentPayment = this.addPaymentSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  addPayment(paymentDto: PaymentModel) {
    this.addPaymentSubject.next(paymentDto);
  }

  // removePayment(paymentDto: PaymentModel) {
  //   this.removePaymentSubject.next(paymentDto);
  // }

  // Show lists of item
  list(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/payment`)
      .pipe(catchError(this.handleError));
  }

  // Create new item
  getOne(id: any): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/payment/${id}`)
      .pipe(catchError(this.handleError));
  }

  //'https://localhost:7213/api/payment-information/paged?pageNumber=1&pageSize=10'
  getAll(pagedAndSortedDto: PagedAndSortedDto): Observable<any> {
    var params = new HttpParams();
    params = params.set('pageNumber', pagedAndSortedDto.pageNumber);
    params = params.set('pageSize', pagedAndSortedDto.pageSize);
    //params = params.set('filter', pagedAndSortedDto.filter);
    return this.httpClient
      .get(`${this.apiUrl}/payment/paged`, { params })
      .pipe(catchError(this.handleError));
  }

  // getAll(pagedAndSortedDto: PagedAndSortedDto): Observable<any> {
  //   var params = new HttpParams();
  //   params = params.set('skipCount', pagedAndSortedDto.skipCount);
  //   params = params.set('maxResultCount', pagedAndSortedDto.maxResultCount);
  //   params = params.set('filter', pagedAndSortedDto.filter);
  //   return this.httpClient.get(`${this.apiUrl}/payment-information/GetPagedAndSortedResult`, {params}).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  create(data: any): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/payment`, data)
      .pipe(catchError(this.handleError));
  }

  // Edit/ Update
  update(id: any, data: any): Observable<any> {
    return this.httpClient
      .put(`${this.apiUrl}/payment/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Delete
  delete(id: any): Observable<any> {
    return this.httpClient
      .delete(`${this.apiUrl}/payment/${id}`)
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
