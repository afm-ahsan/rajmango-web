import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SubSink } from 'subsink';
import * as moment from 'moment';
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

@Component({
  selector: 'app-availability-modal',
  templateUrl: './availability-modal.component.html',
})
export class AvailabilityModalComponent implements OnInit, OnDestroy {
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

    this.form = this.fb.group({
      mangoTypeId: [this.item?.mangoTypeId ?? 0, [Validators.required, Validators.min(1)]],
      seasonYear: [
        this.item?.seasonYear ?? new Date().getFullYear(),
        [Validators.required, Validators.min(2020), Validators.max(2100)],
      ],
      startDate: [
        this.item ? this.item.startDate.format('YYYY-MM-DD') : '',
        [Validators.required],
      ],
      endDate: [
        this.item ? this.item.endDate.format('YYYY-MM-DD') : '',
        [Validators.required],
      ],
      pricePerKg: [this.item?.pricePerKg ?? null, [Validators.required, Validators.min(0.01)]],
      status: [this.item?.status ?? 0, [Validators.required]],
      notes: [this.item?.notes ?? ''],
    });
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
        this.mangoTypeOptions = this.dropdownService.getMangoTypeOptions();
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

    const v = this.form.value;
    this.isLoading = true;

    if (this.isEdit) {
      const command = new UpdateMangoAvailabilityCommand({
        id: this.item!.id,
        seasonYear: +v.seasonYear,
        startDate: moment(v.startDate),
        endDate: moment(v.endDate),
        pricePerKg: +v.pricePerKg,
        status: +v.status as MangoAvailabilityStatus,
        notes: v.notes || undefined,
        updatedBy: this.authService.getLoggedUserId(),
      });
      this.subs.sink = this.proxy.update(this.item!.id, command).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire('Success', 'Availability record updated.', 'success');
          this.modal.close('success');
        },
        error: () => {
          this.isLoading = false;
          Swal.fire('Failed', 'Failed to update record.', 'error');
        },
      });
    } else {
      const command = new CreateMangoAvailabilityCommand({
        mangoTypeId: +v.mangoTypeId,
        seasonYear: +v.seasonYear,
        startDate: moment(v.startDate),
        endDate: moment(v.endDate),
        pricePerKg: +v.pricePerKg,
        status: +v.status as MangoAvailabilityStatus,
        notes: v.notes || undefined,
        createdBy: this.authService.getLoggedUserId(),
      });
      this.subs.sink = this.proxy.create(command).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire('Success', 'Availability record created.', 'success');
          this.modal.close('success');
        },
        error: () => {
          this.isLoading = false;
          Swal.fire('Failed', 'Failed to create record.', 'error');
        },
      });
    }
  }

  cancel(): void { this.modal.dismiss(); }

  ngOnDestroy(): void { this.subs.unsubscribe(); }
}
