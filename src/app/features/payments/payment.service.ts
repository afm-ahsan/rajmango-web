import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly apiUrl = `${environment.apis.default.url}/api`;

  constructor(private http: HttpClient) {}

  getAll(dto: PagedAndSortedDto): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', dto.pageNumber)
      .set('pageSize', dto.pageSize)
      .set('filter', dto.filter ?? '');
    return this.http.get(`${this.apiUrl}/payment/paged`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
