import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SubSink } from 'subsink';
import {
  AddressType,
  CreateUserAddressCommand,
  UpdateUserAddressCommand,
  UserAddressDto,
  UserAddressServiceProxy,
} from 'src/app/services/client-proxy';
import { DropdownModel } from 'src/app/shared/models/dropdown.model';
import { DropdownService } from 'src/app/shared/services/dropdown.service';
import { dropdownRequiredValidator } from 'src/app/shared/validators/dropdown-validators';

@Component({
  selector: 'app-address-modal',
  templateUrl: './address-modal.component.html',
})
export class AddressModalComponent implements OnInit, OnDestroy {
  @Input() address?: UserAddressDto;

  subs = new SubSink();
  isLoading = false;
  addressTypeOptions: DropdownModel[] = [];
  form: FormGroup;

  get isEdit(): boolean { return !!this.address; }
  get title(): string { return this.isEdit ? 'Edit Address' : 'Add Address'; }

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private addressProxy: UserAddressServiceProxy,
    private dropdownService: DropdownService
  ) {}

  ngOnInit(): void {
    this.addressTypeOptions = this.dropdownService.getAddressTypeOptions();
    this.form = this.fb.group({
      addressLine: [this.address?.addressLine ?? '', [Validators.required]],
      city: [this.address?.city ?? '', [Validators.required]],
      area: [this.address?.area ?? ''],
      postalCode: [this.address?.postalCode ?? ''],
      addressType: [this.address?.addressType ?? 0, [dropdownRequiredValidator()]],
      isPrimary: [this.address?.isPrimary ?? false],
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
      const command = new UpdateUserAddressCommand({
        id: this.address!.id,
        addressLine: v.addressLine,
        city: v.city,
        area: v.area || undefined,
        postalCode: v.postalCode || undefined,
        addressType: +v.addressType as AddressType,
        isPrimary: v.isPrimary,
      });
      this.subs.sink = this.addressProxy.update(this.address!.id, command).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire('Success', 'Address updated.', 'success');
          this.modal.close('success');
        },
        error: () => {
          this.isLoading = false;
          Swal.fire('Failed', 'Failed to update address.', 'error');
        },
      });
    } else {
      const command = new CreateUserAddressCommand({
        addressLine: v.addressLine,
        city: v.city,
        area: v.area || undefined,
        postalCode: v.postalCode || undefined,
        addressType: +v.addressType as AddressType,
        isPrimary: v.isPrimary,
      });
      this.subs.sink = this.addressProxy.create(command).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire('Success', 'Address added.', 'success');
          this.modal.close('success');
        },
        error: () => {
          this.isLoading = false;
          Swal.fire('Failed', 'Failed to add address.', 'error');
        },
      });
    }
  }

  cancel(): void { this.modal.dismiss(); }

  ngOnDestroy(): void { this.subs.unsubscribe(); }
}
