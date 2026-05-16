import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, first, of } from 'rxjs';
import { FileService } from 'src/app/shared/services/file-service.service';
import { DropdownService } from 'src/app/shared/services/dropdown.service';
import { DropdownModel } from 'src/app/shared/models/dropdown.model';
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
  location = 'mango-types';
  gradeOptions: DropdownModel[] = [];
  sweetnessLevelOptions: DropdownModel[] = [];

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private fileService: FileService,
    private authService: AuthService,
    private mangoTypeService: MangoTypeService,
    private dropdownService: DropdownService,
  ) {}

  ngOnInit(): void {
    this.gradeOptions = this.dropdownService.getMangoGradeOptions();
    this.sweetnessLevelOptions = this.dropdownService.getSweetnessLevelOptions();
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
      region: [this.mangoTypeDto.region],
      averageWeight: [this.mangoTypeDto.averageWeight],
      mangoGrade: [this.mangoTypeDto.mangoGrade ?? 0],
      sweetnessLevel: [
        this.mangoTypeDto.sweetnessLevel ?? 0,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
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
    this.mangoTypeInputDto.region = formData.region;
    this.mangoTypeInputDto.averageWeight = formData.averageWeight;
    this.mangoTypeInputDto.mangoGrade = formData.mangoGrade;
    this.mangoTypeInputDto.sweetnessLevel = +formData.sweetnessLevel;

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
      imagePath: '',
      region: '',
      averageWeight: '',
      mangoGrade: 0,
      sweetnessLevel: 0,
      sequence: 0,
      isDeleted: false,
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
    if (event) {
      this.newImagePath = event.imagePath;
    }
  };

  createImagePath = (serverPath: string) => {
    const clean = serverPath.startsWith('/') ? serverPath.slice(1) : serverPath;
    return `${environment.apis.default.url}/${clean}`;
  };

  deleteFile(): void {
    if (!this.oldImagePath) return;

    this.fileService.delete(this.oldImagePath).subscribe({
      error: (error) => console.error('File delete failed:', error),
    });
  }

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
