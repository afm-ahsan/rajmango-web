import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { environment } from 'src/environments/environment';
import { FeatureDto } from './models/feature-dto.model';
import { RoleDto } from './models/role-dto.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  apiUrl: string = `${environment.apis.default.url}/api`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  addRoleSubject = new Subject<RoleDto>();
  //removeRoleSubject = new Subject<RoleDto>();
  //currentRole = this.addRoleSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  addRole(roleDto: RoleDto) {
    this.addRoleSubject.next(roleDto);
  }

  // removeRole(roleDto: RoleDto) {
  //   this.removeRoleSubject.next(roleDto);
  // }

  // Show lists of item
  list(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/role`)
      .pipe(catchError(this.handleError));
  }

  // Create new item
  getItem(id: any): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/role/${id}`)
      .pipe(catchError(this.handleError));
  }

  //'https://localhost:7213/api/role-information/paged?pageNumber=1&pageSize=10'
  getAll(pagedAndSortedDto: PagedAndSortedDto): Observable<any> {
    var params = new HttpParams();
    params = params.set('pageNumber', pagedAndSortedDto.pageNumber);
    params = params.set('pageSize', pagedAndSortedDto.pageSize);
    //params = params.set('filter', pagedAndSortedDto.filter);
    return this.httpClient
      .get(`${this.apiUrl}/role/paged`, { params })
      .pipe(catchError(this.handleError));
  }

  // getAll(pagedAndSortedDto: PagedAndSortedDto): Observable<any> {
  //   var params = new HttpParams();
  //   params = params.set('skipCount', pagedAndSortedDto.skipCount);
  //   params = params.set('maxResultCount', pagedAndSortedDto.maxResultCount);
  //   params = params.set('filter', pagedAndSortedDto.filter);
  //   return this.httpClient.get(`${this.apiUrl}/role-information/GetPagedAndSortedResult`, {params}).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  create(data: any): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/role`, data)
      .pipe(catchError(this.handleError));
  }

  // Edit/ Update
  update(id: any, data: any): Observable<any> {
    return this.httpClient
      .put(`${this.apiUrl}/role/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Delete
  delete(id: any): Observable<any> {
    return this.httpClient
      .delete(`${this.apiUrl}/role/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Get count
  getCount(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/role/count`)
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

  //dumy data
  getPermissions(){
    return this.initObject();
  }

  initObject() {
    let features: FeatureDto[] = [
      {id: 1, name: 'Dashboard Access', isAssigned: false},
      {id: 2, name: 'Manage Sales', isAssigned: false},
      {id: 3, name: 'Remove Sale Order', isAssigned: false},
      
      //Portal area
      {id: 4, name: 'POS Portal', isAssigned: false},
      {id: 5, name: 'Allow To Process Billing In POS Portal', isAssigned: false},
      {id: 6, name: 'Kitchen Portal', isAssigned: false},

      //Food area
      {id: 7, name: 'Manage Food Category', isAssigned: false},
      {id: 8, name: 'Manage Food Items', isAssigned: false},
      {id: 9, name: 'Manage Modifiers', isAssigned: false},
      {id: 10, name: 'Manage Ingredients', isAssigned: false},

      //Expense area
      {id: 11, name: 'Manage Expense Types', isAssigned: false},
      {id: 12, name: 'Manage Expenses', isAssigned: false},

      //People area
      {id: 13, name: 'Manage Users', isAssigned: false},
      {id: 14, name: 'Manage User Roles', isAssigned: false},
      {id: 15, name: 'Manage Customers Roles', isAssigned: false},

      //Reports area
      {id: 16, name: 'Overall Report', isAssigned: false},
      {id: 17, name: 'Tax Report', isAssigned: false},
      {id: 18, name: 'Expense Report', isAssigned: false},
      {id: 19, name: 'Stock Alerts', isAssigned: false},


      //Advance area
      {id: 20, name: 'Import And Exports', isAssigned: false},
      {id: 21, name: 'Manage Service Tables', isAssigned: false},
      {id: 22, name: 'Manage Payment Methods', isAssigned: false},
      {id: 23, name: 'Manage Pickup Points', isAssigned: false},
      {id: 24, name: 'Database Backup', isAssigned: false},
      {id: 25, name: 'Manage Languages', isAssigned: false},


      //Configuration area
      {id: 26, name: 'General Configuration', isAssigned: false},
      {id: 27, name: 'Appearance Configuration', isAssigned: false},
      {id: 28, name: 'Localization Configuration', isAssigned: false},
      {id: 29, name: 'Outgoing Mail Configuration', isAssigned: false},
      {id: 30, name: 'Currency Configuration', isAssigned: false},
      {id: 31, name: 'Authentication Configuration', isAssigned: false},
      {id: 32, name: 'Captcha Configuration', isAssigned: false},
      {id: 33, name: 'Printer Configuration', isAssigned: false},
    ];

    return features;
  }
}
