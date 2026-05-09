import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CourierService {
  apiUrl: string = `${environment.apis.default.url}/api`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  
}
