import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SubSink } from 'subsink';
import {
  CreateMangoAvailabilityCommand,
  MangoAvailabilityDto,
  MangoAvailabilityServiceProxy,
  MangoAvailabilityStatus,
  MangoTypeServiceProxy,
  UpdateMangoAvailabilityCommand,
} from 'src/app/services/client-proxy';
import { AuthService } from '../../auth';
import { DropdownModel } from 'src/app/shared/models/dropdown.model';
import { DropdownService } from 'src/app/shared/services/dropdown.service';
import { extractApiErrorMessage } from 'src/app/shared/utils/api-error.utils';
import { DateUtils } from 'src/app/shared/utils/date.utils';

@Component({
  selector: 'app-availability-modal',
  templateUrl: './availability-modal.component.html',
})
export class AvailabilityModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() item?: MangoAvailabilityDto;

  subs = new SubSink();
  isLoading = false;
  statusOptions: DropdownModel[] = [];
  mangoTypeOptions: DropdownModel[] = [];
  form: FormGroup;

  get isEdit(): boolean { return !!this.item; }
  get title(): string { return this.isEdit ? 'Edit Availability' : 'Add Availability'; }

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private proxy: MangoAvailabilityServiceProxy,
    private mangoTypeProxy: MangoTypeServiceProxy,
    private authService: AuthService,
    private dropdownService: DropdownService
  ) {}

  ngOnInit(): void {
    this.statusOptions = this.dropdownService.getMangoAvailabilityStatusOptions();
    this.loadMangoTypes();
    this.buildForm();
    // item may already be set if NgBootstrap assigned it before ngOnInit
    if (this.item) {
      this.patchForm();
    }
  }

  // NgBootstrap sets @Input() via componentInstance AFTER open() returns.
  // If ngOnInit fires first (item is still undefined), ngOnChanges picks it up here.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.form) {
      this.patchForm();
      this.syncMangoTypeDisabledState();
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      mangoTypeId: [0, [Validators.required, Validators.min(1)]],
      seasonYear: [
        new Date().getFullYear(),
        [Validators.required, Validators.min(2020), Validators.max(2100)],
      ],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      pricePerKg: [null, [Validators.required, Validators.min(0.01)]],
      status: [0, [Validators.required]],
      notes: [''],
    });
    this.syncMangoTypeDisabledState();
  }

  private patchForm(): void {
    if (!this.item || !this.form) return;
    this.form.patchValue({
      mangoTypeId: this.item.mangoTypeId,
      seasonYear: this.item.seasonYear,
      startDate: this.item.startDate.format('YYYY-MM-DD'),
      endDate: this.item.endDate.format('YYYY-MM-DD'),
      pricePerKg: this.item.pricePerKg,
      status: this.item.status,
      notes: this.item.notes ?? '',
    });
  }

  // Disabling via formControl.disable() is the Angular-idiomatic approach:
  // it visually disables the DOM element via setDisabledState() AND excludes
  // the control from validators — so mangoTypeId = 0 never fails min(1) on edit.
  private syncMangoTypeDisabledState(): void {
    const ctrl = this.form?.get('mangoTypeId');
    if (!ctrl) return;
    this.isEdit ? ctrl.disable() : ctrl.enable();
  }

  private loadMangoTypes(): void {
    this.subs.sink = this.mangoTypeProxy.get().subscribe({
      next: (res) => {
        this.mangoTypeOptions = this.dropdownService.mapToDropdown(
          res.data ?? [],
          'id',
          'name'
        );
      },
      error: () => {
        this.mangoTypeOptions = [];
        Swal.fire('Failed', 'Unable to load mango types. Please close and try again.', 'error');
      },
    });
  }

  isInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    // getRawValue() includes disabled controls (mangoTypeId is disabled on edit)
    const v = this.form.getRawValue();
    this.isLoading = true;

    const notesVal = v.notes?.trim() || null;

    if (this.isEdit) {
      const command = new UpdateMangoAvailabilityCommand({
        id: this.item!.id,
        seasonYear: +v.seasonYear,
        startDate: DateUtils.toUtcMoment(v.startDate)!,
        endDate: DateUtils.toUtcMoment(v.endDate)!,
        pricePerKg: +v.pricePerKg,
        status: +v.status as MangoAvailabilityStatus,
        notes: notesVal ?? undefined,
        updatedBy: this.authService.getLoggedUserId(),
      });
      this.subs.sink = this.proxy.update(this.item!.id, command).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res?.succeeded === false) {
            const msg = res?.messages?.join('\n') || 'Failed to update record.';
            Swal.fire('Failed', msg, 'error');
            return;
          }
          Swal.fire('Success', 'Availability record updated.', 'success');
          this.modal.close('success');
        },
        error: (err: any) => {
          this.isLoading = false;
          Swal.fire('Failed', extractApiErrorMessage(err, 'Failed to update record.'), 'error');
        },
      });
    } else {
      const command = new CreateMangoAvailabilityCommand({
        mangoTypeId: +v.mangoTypeId,
        seasonYear: +v.seasonYear,
        startDate: DateUtils.toUtcMoment(v.startDate)!,
        endDate: DateUtils.toUtcMoment(v.endDate)!,
        pricePerKg: +v.pricePerKg,
        status: +v.status as MangoAvailabilityStatus,
        notes: notesVal ?? undefined,
        createdBy: this.authService.getLoggedUserId(),
      });
      this.subs.sink = this.proxy.create(command).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res?.succeeded === false) {
            const msg = res?.messages?.join('\n') || 'Failed to create record.';
            Swal.fire('Failed', msg, 'error');
            return;
          }
          Swal.fire('Success', 'Availability record created.', 'success');
          this.modal.close('success');
        },
        error: (err: any) => {
          this.isLoading = false;
          Swal.fire('Failed', extractApiErrorMessage(err, 'Failed to create record.'), 'error');
        },
      });
    }
  }

  cancel(): void { this.modal.dismiss(); }

  ngOnDestroy(): void { this.subs.unsubscribe(); }
}
