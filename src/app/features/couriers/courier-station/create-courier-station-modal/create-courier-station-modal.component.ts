import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, of, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/features/auth';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { CourierProviderService } from '../../courier-provider/courier-provider.service';
import { CourierStationService } from '../courier-station.service';
import { CourierStationDto } from '../models/courier-station-dto';
import { CreateCourierStationDto } from '../models/create-courier-station.dto';

@Component({
  selector: 'app-create-courier-station-modal',
  templateUrl: './create-courier-station-modal.component.html',
  styleUrls: ['./create-courier-station-modal.component.scss']
})
export class CreateCourierStationModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  
  formGroup: FormGroup;// = this.fb.group({});
  courierStationDto: CourierStationDto = this.getDefaultStation();
  createDto: CreateCourierStationDto = {} as CreateCourierStationDto;
  courierProviderOptions: { id: number; name: string }[] = [];
  subs = new SubSink();
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private courierProviderService: CourierProviderService,
    private courierStationService: CourierStationService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.startLoading();

    this.subs.sink = this.courierProviderService.getDropdown().pipe(
      tap((response: any) => (this.courierProviderOptions = response.data)),
      switchMap(() => {
        if (this.id && this.id > 0) {
          return this.courierStationService.getById(this.id); // fetch for edit
        }
        return of(null); // for create mode
      })
    ).subscribe({
      next: (response: any) => {
        if (response) {
          this.courierStationDto = response.data;
        } else {
          this.courierStationDto = this.getDefaultStation();
        }
        this.initializeForm(); // 👈 always initialize here safely
        this.completeLoading();
        this.cdRef.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading data', err);
        this.completeLoading();
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getDefaultStation(): CourierStationDto {
    return {
      id: 0,
      name: '',
      addressLine: '',
      city: '',
      area: '',
      supportPhone1: '',
      supportPhone2: '',
      email: '',
      latitude: undefined,
      longitude: undefined,
      googleMapUrl: '',
      isActive: true,
      courierProviderId: 0,
      courierProviderName: '',
      courierAreaMaps: []
    };
  }

  initializeForm(): void {
    this.formGroup = this.fb.group({
      courierProviderId: [this.courierStationDto.courierProviderId, Validators.required],
      name: [this.courierStationDto.name, [Validators.required, Validators.maxLength(100)]],
      addressLine: [this.courierStationDto.addressLine, [Validators.required, Validators.maxLength(500)]],
      city: [this.courierStationDto.city, [Validators.required, Validators.maxLength(50)]],
      area: [this.courierStationDto.area, [Validators.required, Validators.maxLength(50)]],
      supportPhone1: [this.courierStationDto.supportPhone1, [Validators.required, Validators.maxLength(15)]],
      supportPhone2: [this.courierStationDto.supportPhone2, Validators.maxLength(15)],
      email: [this.courierStationDto.email, Validators.email],
      latitude: [this.courierStationDto.latitude],
      longitude: [this.courierStationDto.longitude],
      googleMapUrl: [this.courierStationDto.googleMapUrl, Validators.maxLength(2048)],
      isActive: [this.courierStationDto.isActive]
    });
  }

  save(): void {
    if (!this.formGroup || this.formGroup.invalid) return;

    this.startLoading();
    this.prepareDto();

    const request$ = this.id
      ? this.courierStationService.update(this.id, this.createDto)
      : this.courierStationService.create(this.createDto);

    this.subs.sink = request$.pipe(
      finalize(() => this.completeLoading())
    ).subscribe({
      next: (response: CourierStationDto) => {
        this.courierStationDto = response;
        Swal.fire('SUCCESS', `Data ${this.id ? 'updated' : 'saved'} successfully.`, 'success');
        this.modal.close('success');
      },
      error: (error) => {
        this.modal.dismiss(error);
        Swal.fire('Failed', `Courier Station ${this.id ? 'update' : 'creation'} failed.`, 'error');
      }
    });
  }

  prepareDto(): void {
    const currentUserId = this.authService.getLoggedUserId();
    const formData = this.formGroup.value;

    this.createDto = {
      id: this.courierStationDto.id || 0,
      courierProviderId: formData.courierProviderId,
      name: formData.name,
      addressLine: formData.addressLine,
      city: formData.city,
      area: formData.area,
      supportPhone1: formData.supportPhone1,
      supportPhone2: formData.supportPhone2,
      email: formData.email,
      latitude: formData.latitude,
      longitude: formData.longitude,
      googleMapUrl: formData.googleMapUrl,
      isActive: formData.isActive,
      createdBy: this.id ? 0 : currentUserId,
      updatedBy: this.id ? currentUserId : 0
    };
  }
  
  startLoading(): void {
    this.isLoading = true;
    this.loaderService.show();
  }

  completeLoading(): void {
    this.isLoading = false;
    this.loaderService.hide();
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup?.get(controlName);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  isControlValid(controlName: string): boolean {
    const control = this.formGroup?.get(controlName);
    return !!(control?.valid && (control.dirty || control.touched));
  }

  controlHasError(error: string, controlName: string): boolean {
    const control = this.formGroup?.get(controlName);
    return !!control?.hasError(error);
  }
}
