import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-single-file-upload',
  templateUrl: './single-file-upload.component.html',
  styleUrls: ['./single-file-upload.component.scss']
})
export class SingleFileUploadComponent implements OnInit {

  status: "initial" | "uploading" | "success" | "fail" | "deleting"= "initial";
  file: File | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.status = "initial";
      this.file = file;
    }
  }

  onUpload() {
    if (this.file) {
      const formData = new FormData();
  
      formData.append('file', this.file, this.file.name);

     const upload$ = this.http.post("https://httpbin.org/post", formData);
  
      this.status = 'uploading';
  
      upload$.subscribe({
        next: (res: any) => {
          console.log(res);
          this.status = 'success';
        },
        error: (error: any) => {
          this.status = 'fail';
          return throwError(() => error);
        },
      });
    }
  }

  onRemove() {
    if (this.file) {
      const formData = new FormData();
  
      formData.append('file', this.file, this.file.name);

     const remove$ = this.http.post("https://httpbin.org/post", formData);
  
      this.status = 'deleting';
  
      remove$.subscribe({
        next: (res: any) => {
          console.log(res);
          this.status = 'success';
          if(this.file){
          this.file = null;
          this.cdr.detectChanges();
          }
        },
        error: (error: any) => {
          this.status = 'fail';
          return throwError(() => error);
        },
      });
    }
  }

}
