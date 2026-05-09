import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/features/auth';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { CourierStationService } from '../../courier-station/courier-station.service';
import { CourierAreaMapService } from '../courier-area-map.service';
import { CourierAreaMapDto } from '../models/courier-area-map-dto';
import { CreateCourierAreaMapDto } from '../models/create-courier-area-map.dto';

@Component({
  selector: 'app-creat-courier-area-map-modal',
  templateUrl: './creat-courier-area-map-modal.component.html',
  styleUrls: ['./creat-courier-area-map-modal.component.scss']
})
export class CreatCourierAreaMapModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  
  formGroup: FormGroup;// = this.fb.group({});
  courierAreaMapDto: CourierAreaMapDto = this.getDefaultAreaMap();
  createDto: CreateCourierAreaMapDto = {} as CreateCourierAreaMapDto;
  courierStationOptions: { id: number; name: string }[] = [];
  isLoading = false;
  isSubmitting = false;
  subs = new SubSink();

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private courierStationService: CourierStationService,
    private courierAreaMapService: CourierAreaMapService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.startLoading();

    this.subs.sink = this.courierStationService.getDropdown().pipe(
      tap((response: any) => (this.courierStationOptions = response.data)),
      switchMap(() => {
        if (this.id && this.id > 0) {
          return this.courierAreaMapService.getById(this.id); // fetch for edit
        }
        return of(null); // for create mode
      })
    ).subscribe({
      next: (response: any) => {
        if (response) {
          this.courierAreaMapDto = response.data;
        } else {
          this.courierAreaMapDto = this.getDefaultAreaMap();
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

  getDefaultAreaMap(): CourierAreaMapDto {
    return {
      id: 0,
      area: '',
      courierStationId: 0,
    };
  }

  initializeForm(): void {
    this.formGroup = this.fb.group({
      courierStationId: [this.courierAreaMapDto.courierStationId, Validators.required],
      area: [this.courierAreaMapDto.area, [Validators.required, Validators.maxLength(100)]],
    });
  }

  save(): void {
    if (!this.formGroup || this.formGroup.invalid) return;

    this.isSubmitting = true;
    this.loaderService.show();
    this.prepareDto();

    const request$ = this.id
      ? this.courierAreaMapService.update(this.id, this.createDto)
      : this.courierAreaMapService.create(this.createDto);

    this.subs.sink = request$.subscribe({
      next: (response: CourierAreaMapDto) => {
        this.courierAreaMapDto = response;
        this.loaderService.hide();
        Swal.fire('SUCCESS', `Data ${this.id ? 'updated' : 'saved'} successfully.`, 'success');
        this.modal.close('success');
      },
      error: (error) => {
        this.loaderService.hide();
        this.modal.dismiss(error);
        Swal.fire('Failed', `Courier AreaMap ${this.id ? 'update' : 'creation'} failed.`, 'error');
      }
    });
  }

  prepareDto(): void {
    const currentUserId = this.authService.getLoggedUserId();
    const formData = this.formGroup.value;

    this.createDto = {
      id: this.courierAreaMapDto.id || 0,
      courierStationId: formData.courierStationId,
      area: formData.area,
      createdBy: this.id ? 0 : currentUserId,
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
