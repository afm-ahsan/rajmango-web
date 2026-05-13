import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FileService } from '../../services/file-service.service';

interface UploadedFile {
  path: string;
  fileName: string;
}

@Component({
  selector: 'app-multi-upload',
  templateUrl: './multi-upload.component.html',
})
export class MultiUploadComponent {
  @Input() location: string = '';
  @Input() maxImages: number = 3;
  @Input() prefix?: string;
  @Input() entityId?: number;
  @Output() imagesChanged = new EventEmitter<string[]>();

  uploads: UploadedFile[] = [];
  isUploading = false;

  constructor(private fileService: FileService) {}

  get atLimit(): boolean {
    return this.uploads.length >= this.maxImages;
  }

  get uploadedPaths(): string[] {
    return this.uploads.map((u) => u.path);
  }

  uploadFile(files: any): void {
    if (!files || files.length === 0 || this.atLimit) return;

    const file: File = files[0];
    const formData = new FormData();
    formData.append('file', file, file.name);

    this.isUploading = true;
    this.fileService.upload(formData, { domain: this.location, prefix: this.prefix, entityId: this.entityId }).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.Response) {
          this.uploads.push({ path: event.body.imagePath, fileName: file.name });
          this.imagesChanged.emit(this.uploadedPaths);
        }
      },
      error: () => {},
    }).add(() => (this.isUploading = false));
  }

  remove(index: number): void {
    const upload = this.uploads[index];
    this.fileService.delete(upload.path).subscribe();
    this.uploads.splice(index, 1);
    this.imagesChanged.emit(this.uploadedPaths);
  }

  imgUrl(serverPath: string): string {
    const clean = serverPath.startsWith('/') ? serverPath.slice(1) : serverPath;
    return `${environment.apis.default.url}/${clean}`;
  }
}
