import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ImagePathService {
  createFullPath(serverPath: string): string {
    return `${environment.apis.default.url}/${serverPath}`;
  }
}