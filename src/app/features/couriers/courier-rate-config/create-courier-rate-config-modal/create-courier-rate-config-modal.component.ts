import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, first, of } from 'rxjs';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/features/auth';
import { DropdownModel, EntityDropdownModel } from 'src/app/shared/models/dropdown.model';
import { DropdownService } from 'src/app/shared/services/dropdown.service';
import { dropdownRequiredValidator } from 'src/app/shared/validators/dropdown-validators';
import { CourierRateConfigService } from '../courier-rate-config.service';
import { CourierRateConfigDto } from '../models/courier-rate-config-dto';
import { CreateCourierRateConfigDto } from '../models/create-courier-rate-config-dto';
import { CourierProviderService } from '../../courier-provider/courier-provider.service';

@Component({
  selector: 'app-create-courier-rate-config-modal',
  templateUrl: './create-courier-rate-config-modal.component.html',
  styleUrls: ['./create-courier-rate-config-modal.component.scss']
})
export class CreateCourierRateConfigModalComponent implements OnInit, OnDestroy {
  @Input() id: number = 0;

  formGroup: FormGroup;
  isLoading = false;
  isLoadingProviders = false;
  courierProviders: EntityDropdownModel[] = [];
  locationTypeOptions: DropdownModel[] = [];
  dto: CourierRateConfigDto = this.getDefault();
  private subs = new SubSink();

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private authService: AuthService,
    private service: CourierRateConfigService,
    private courierProviderService: CourierProviderService,
    private dropdownService: DropdownService
  ) {}

  ngOnInit(): void {
    this.locationTypeOptions = this.dropdownService.getLocationTypeOptions();
    this.loadProviders();
  }

  private loadProviders(): void {
    this.isLoadingProviders = true;
    this.subs.sink = this.courierProviderService.getDropdown()
      .pipe(
        first(),
        catchError(() => of({ data: [] })),
        finalize(() => { this.isLoadingProviders = false; })
      )
      .subscribe((res: any) => {
        this.courierProviders = res?.data ?? [];
        this.initializeForm();
        if (this.id) {
          this.loadItem();
        }
      });
  }

  private initializeForm(): void {
    this.formGroup = this.fb.group({
      courierProviderId: [this.dto.courierProviderId, [dropdownRequiredValidator()]],
      locationType: [this.dto.locationType, [dropdownRequiredValidator()]],
      ratePerKg: [this.dto.ratePerKg, [Validators.required, Validators.min(0.01)]],
      minimumCharge: [this.dto.minimumCharge, [Validators.required, Validators.min(0)]],
      sequence: [this.dto.sequence, [Validators.required, Validators.min(1)]],
      isActive: [this.dto.isActive]
    });
  }

  private loadItem(): void {
    this.isLoading = true;
    this.subs.sink = this.service.getById(this.id)
      .pipe(
        first(),
        catchError(error => {
          this.modal.dismiss(error);
          return of({ data: this.getDefault() });
        }),
        finalize(() => { this.isLoading = false; })
      )
      .subscribe((response: any) => {
        this.dto = response.data;
        this.formGroup.patchValue({
          courierProviderId: this.dto.courierProviderId,
          locationType: this.dto.locationType,
          ratePerKg: this.dto.ratePerKg,
          minimumCharge: this.dto.minimumCharge,
          sequence: this.dto.sequence,
          isActive: this.dto.isActive
        });
      });
  }

  save(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) return;

    this.isLoading = true;
    const saveDto = this.prepareDto();
    const request$ = this.id
      ? this.service.update(this.id, saveDto)
      : this.service.create(saveDto);

    this.subs.sink = request$.pipe(
      finalize(() => { this.isLoading = false; })
    ).subscribe({
      next: () => {
        this.modal.close('success');
      },
      error: (error) => {
        const msg = error?.error?.messages?.join('\n') ?? `Rate config ${this.id ? 'update' : 'creation'} failed.`;
        Swal.fire('Failed', msg, 'error');
      }
    });
  }

  private prepareDto(): CreateCourierRateConfigDto {
    const currentUserId = this.authService.getLoggedUserId();
    const v = this.formGroup.value;
    return {
      id: this.dto.id || 0,
      courierProviderId: +v.courierProviderId,
      locationType: +v.locationType,
      ratePerKg: +v.ratePerKg,
      minimumCharge: +v.minimumCharge,
      sequence: +v.sequence,
      isActive: v.isActive,
      createdBy: this.id ? 0 : currentUserId,
      updatedBy: this.id ? currentUserId : 0
    };
  }

  private getDefault(): CourierRateConfigDto {
    return {
      id: 0,
      courierProviderId: 0,
      courierProviderName: '',
      locationType: 0,
      ratePerKg: 0,
      minimumCharge: 0,
      sequence: 1,
      isActive: true
    };
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup?.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string): boolean {
    const control = this.formGroup?.get(controlName);
    return !!control && control.hasError(validation) && (control.dirty || control.touched);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
