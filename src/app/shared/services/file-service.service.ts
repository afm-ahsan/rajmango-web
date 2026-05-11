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

    return this.http.post(`${this.apiUrl}/upload-image`, formData, {
        reportProgress: true,
        observe: 'events',
        params,
    });
  }

  public download(fileUrl: string) { 
    return this.http.get(`${this.apiUrl}/download?fileUrl=${fileUrl}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }); 
  }

  // public delete(filePath: string) {
  //   return this.http.post(`${this.apiUrl}/delete`, filePath, {
  //       reportProgress: true,
  //       observe: 'events',
  //   });
  // }

  public delete(fileName: string, location: string): Observable<any>{
    return this.http.delete(`${this.apiUrl}/delete-image/${fileName}/${location}`);
  }

  public getPhotos() { 
    return this.http.get(`${this.apiUrl}/getPhotos`); 
  }
}