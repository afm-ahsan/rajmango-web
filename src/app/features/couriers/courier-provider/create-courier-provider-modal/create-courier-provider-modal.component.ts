import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, first, of } from 'rxjs';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/features/auth';
import { CourierProviderService } from '../courier-provider.service';
import { CourierProviderDto } from '../models/courier-provider-dto';
import { CreateCourierProviderDto } from '../models/create-courier-provider-dto';

@Component({
  selector: 'app-create-courier-provider-modal',
  templateUrl: './create-courier-provider-modal.component.html',
  styleUrls: ['./create-courier-provider-modal.component.scss']
})
export class CreateCourierProviderModalComponent implements OnInit, OnDestroy {
  @Input() id: number;

  formGroup: FormGroup;
  isLoading = false;
  courierProviderDto: CourierProviderDto = this.getDefaultProvider();
  private dto: CreateCourierProviderDto = {} as CreateCourierProviderDto;
  private subs = new SubSink();

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private authService: AuthService,
    private courierProviderService: CourierProviderService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.id) {
      this.loadCourierProvider();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private initializeForm(): void {
    this.formGroup = this.fb.group({
      name: [this.courierProviderDto.name, [Validators.required, Validators.maxLength(100)]],
      description: [this.courierProviderDto.description],
      supportPhone: [this.courierProviderDto.supportPhone],
      email: [this.courierProviderDto.email, Validators.email],
      isActive: [this.courierProviderDto.isActive]
    });
  }

  private loadCourierProvider(): void {
    this.isLoading = true;
    this.subs.sink = this.courierProviderService.getById(this.id)
      .pipe(
        first(),
        catchError(error => {
          this.modal.dismiss(error);
          return of({ data: this.getDefaultProvider() });
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((response: any) => {
        this.courierProviderDto = response.data;
        this.formGroup.patchValue(this.courierProviderDto);
      });
  }

  save(): void {
    if (this.formGroup.invalid) return;

    this.isLoading = true;
    this.prepareDto();
    const request$ = this.id ?
      this.courierProviderService.update(this.id, this.dto) :
      this.courierProviderService.create(this.dto);

    this.subs.sink = request$.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: CourierProviderDto) => {
        this.courierProviderDto = response;
        Swal.fire('SUCCESS', `Data ${this.id ? 'updated' : 'saved'} successfully.`, 'success');
        this.modal.close('success');
      },
      error: (error) => {
        this.modal.dismiss(error);
        Swal.fire('Failed', `Courier provider ${this.id ? 'update' : 'creation'} failed.`, 'error');
      }
    });
  }

  private prepareDto(): void {
    const currentUserId = this.authService.getLoggedUserId();
    const formData = this.formGroup.value;

    this.dto = {
      id: this.courierProviderDto.id || 0,
      name: formData.name,
      description: formData.description,
      supportPhone: formData.supportPhone,
      email: formData.email,
      isActive: formData.isActive,
      createdBy: this.id ? 0 : currentUserId,
      updatedBy: this.id ? currentUserId : 0
    };
  }

  private getDefaultProvider(): CourierProviderDto {
    return {
      id: 0,
      name: '',
      description: '',
      supportPhone: '',
      email: '',
      isActive: true
    };
  }

  // Validation helpers
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    return !!control && control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    return !!control && control.hasError(validation) && (control.dirty || control.touched);
  }
}
