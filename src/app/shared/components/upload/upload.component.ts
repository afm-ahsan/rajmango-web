import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FileService } from '../../services/file-service.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @Input() location: string;
  @Output() public uploadFinished = new EventEmitter();
  progress: number = 0;
  message: string = '';
  imagePath: string = '';
  fileName: string = '';
  working = false;

  constructor(private fileService: FileService ) { }

  ngOnInit() {
  }

  uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    this.fileName = fileToUpload.name;
    const formData = new FormData();
    formData.append(this.location, fileToUpload, fileToUpload.name);

    this.working = true;
    this.message = '';

    //this.fileService.upload(formData).subscribe((event: any) => {
    this.fileService.upload(formData)
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress){
            if(event?.loaded && event?.total ) { 
              this.progress = Math.round(100 * event.loaded / event.total);
            } 
          }
          else if (event.type === HttpEventType.Response) {
            this.message = 'Image Uploaded.';
            this.imagePath = event.body.imagePath;
            this.uploadFinished.emit(event.body);
          }
        },
        error: (err: HttpErrorResponse) => console.log(err)
      }).add(() => {
      this.working = false;
    });
  }

  deleteFile = (fileName: string) => {
    if (fileName.length === 0) {
      return;
    }
    
    this.working = true;
    this.message = '';

    this.fileService.delete(fileName, this.location)
        .subscribe({
            next: data => {
              console.log(data);
              this.message = 'Image Deleted';
              this.imagePath = '';
              this.uploadFinished.emit(this.imagePath);
            },
            error: error => {
                console.error('There was an error!', error);
            }
        }).add(() => {
            this.working = false;
          });
  }  

  public createImgPath = (serverPath: string) => { 
    return `${environment.apis.default.url}/${serverPath}`; 
  }
}