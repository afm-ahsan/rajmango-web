import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface UploadOptions {
  domain?: string;
  prefix?: string;
  entityId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiUrl: string = `${environment.apis.default.url}/api/file`;

  constructor(private http: HttpClient) { }

  public upload(formData: FormData, options?: UploadOptions) {
    let params = new HttpParams();
    if (options?.domain)    params = params.set('domain',   options.domain);
    if (options?.prefix)    params = params.set('prefix',   options.prefix);
    if (options?.entityId)  params = params.set('entityId', String(options.entityId));

    return this.http.post(`${this.apiUrl}/upload`, formData, {
        reportProgress: true,
        observe: 'events',
        params,
    });
  }

  public download(relativePath: string) {
    return this.http.get(`${this.apiUrl}/download`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
      params: new HttpParams().set('relativePath', relativePath),
    });
  }

  public delete(relativePath: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`, {
      params: new HttpParams().set('relativePath', relativePath),
    });
  }
}