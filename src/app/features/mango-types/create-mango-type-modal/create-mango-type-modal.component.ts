import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, first, of } from 'rxjs';
import { FileService } from 'src/app/shared/services/file-service.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth';
import { MangoTypeService } from '../mango-type.service';
import { MangoTypeDto } from '../models/mango-type-dto.model';
import { MangoTypeInputDto } from '../models/mango-type-input-dto.model';

@Component({
  selector: 'app-create-mango-type-modal',
  templateUrl: './create-mango-type-modal.component.html',
  styleUrls: ['./create-mango-type-modal.component.scss']
})
export class CreateMangoTypeModalComponent implements OnInit, OnDestroy {
  @Input() id: number;

  mangoTypeInputDto: MangoTypeInputDto = {} as MangoTypeInputDto;
  mangoTypeDto: MangoTypeDto = {} as MangoTypeDto;
  formGroup: FormGroup;
  subs = new SubSink();
  photos: string[] = [];
  newImagePath: string;
  oldImagePath: string;
  isLoading = false;
  location = 'MangoType';

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private fileService: FileService,
    private authService: AuthService,
    private mangoTypeService: MangoTypeService,
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.loadData();
  }

  loadData() {
    if (!this.id) {
      this.mangoTypeDto = this.initObject();
      this.loadForm();
    } else {
      this.isLoading = true;
      this.subs.sink = this.mangoTypeService
        .getOne(this.id)
        .pipe(
          first(),
          catchError((error) => {
            this.modal.dismiss(error);
            return of(this.initObject());
          }))
        .subscribe((response: any) => {
          this.isLoading = false;
          this.mangoTypeDto = response.data;
          this.oldImagePath = this.mangoTypeDto.imagePath;
          this.loadForm();
        });
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [
        this.mangoTypeDto.name,
        Validators.compose([
          Validators.required,
          Validators.maxLength(256),
        ]),
      ],
      description: [this.mangoTypeDto.description],
      pricePerKg: [this.mangoTypeDto.pricePerKg,
         Validators.compose([
          Validators.required,
        ])],
      isAvailable: [this.mangoTypeDto.isAvailable],
    });
  }

  save() {
    this.prepareData();
    if (this.mangoTypeDto.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    this.subs.sink = this.mangoTypeService
      .update(this.id, this.mangoTypeInputDto)
      .subscribe({
        next: (respone: MangoTypeDto) => {
          this.mangoTypeDto = respone;
          Swal.fire('SUCCESS', 'Data updated successfully.', 'success');
          this.modal.close();
        },
        error: (error) => {
          this.modal.dismiss(error);
          Swal.fire('Failed', 'Data update failed.', 'error');
          return of(this.initObject());
        }
      });
  }

  create() {
    this.subs.sink = this.mangoTypeService
      .create(this.mangoTypeInputDto)
      .subscribe({
        next: (response: MangoTypeDto) => {
          this.mangoTypeDto = response;
          Swal.fire('SUCCESS', 'Data saved successfully.', 'success');
          this.modal.close();
        },
        error: (error) => {
          this.modal.dismiss(error);
          Swal.fire('Failed', 'Mango type creation failed.', 'error');
          return of(this.initObject());
        }
      });
  }

  prepareData() {
    const loggedUesrId = this.authService.getLoggedUserId();
    const formData = this.formGroup.value;
    this.mangoTypeInputDto.name = formData.name;
    this.mangoTypeInputDto.description = formData.description;
    this.mangoTypeInputDto.pricePerKg = formData.pricePerKg;
    this.mangoTypeInputDto.isAvailable = formData.isAvailable;

    if(this.newImagePath){
      this.mangoTypeInputDto.imagePath = this.newImagePath;
    }else{
      this.mangoTypeInputDto.imagePath = this.oldImagePath;
    }
    if (this.mangoTypeDto.id) {
      this.mangoTypeInputDto.id = this.mangoTypeDto.id;
      this.mangoTypeInputDto.createdBy = this.mangoTypeDto.createdBy;
      this.mangoTypeInputDto.createdAt = this.mangoTypeDto.createdAt;
      this.mangoTypeInputDto.updatedBy = loggedUesrId;
    } else {
      this.mangoTypeInputDto.createdAt = new Date();
      this.mangoTypeInputDto.createdBy = loggedUesrId;
    }
  }

  initObject() {
    const EMPTY_ENTITY: MangoTypeDto = {
      id: 0,
      name: '',
      description: '',
      pricePerKg: 0,
      imagePath: '',
      sequence: 0,
      isAvailable: true,
      isDeleted: true,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    };
    return EMPTY_ENTITY;
  }

  uploadFinished = (event: any) => {
    if (event){
      this.newImagePath = event.imagePath;
      this.mangoTypeDto.imagePath = '';
    }
  };

  createImagePath = (serverPath: string) => {
    return `${environment.apis.default.url}/${serverPath}`;
  };

  deleteFile () {
    if (this.oldImagePath.length === 0) {
      return;
    }

    var imagePaths = this.oldImagePath.split('\\');
    var fileName = imagePaths[imagePaths.length-1];

    this.fileService
      .delete(fileName, this.location)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.error('There was an error!', error);
        },
      });
  };

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string | number): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string | number): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
