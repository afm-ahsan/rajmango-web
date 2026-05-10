import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SubSink } from 'subsink';
import {
  MyProfileDto,
  ProfileServiceProxy,
  UserAddressDto,
  UserAddressServiceProxy,
} from 'src/app/services/client-proxy';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { AddressModalComponent } from '../address-modal/address-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isProfileLoading = false;
  isSavingProfile = false;
  isAddressLoading = false;

  profile: MyProfileDto | null = null;
  addresses: UserAddressDto[] = [];
  profileForm: FormGroup;
  profileImagePath: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private profileProxy: ProfileServiceProxy,
    private addressProxy: UserAddressServiceProxy,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      currentPassword: [''],
      newPassword: [''],
    });
    this.loadProfile();
    this.loadAddresses();
  }

  loadProfile(): void {
    this.isProfileLoading = true;
    this.subs.sink = this.profileProxy.get().subscribe({
      next: (res: any) => {
        this.profile = res?.data ?? null;
        if (this.profile) {
          this.profileImagePath = (this.profile as any).imagePath ?? '';
          this.profileForm.patchValue({
            firstName: this.profile.firstName ?? '',
            lastName: this.profile.lastName ?? '',
            phoneNumber: this.profile.phoneNumber ?? '',
          });
        }
        this.isProfileLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isProfileLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  loadAddresses(): void {
    this.isAddressLoading = true;
    this.subs.sink = this.addressProxy.get().subscribe({
      next: (res: any) => {
        this.addresses = res?.data ?? [];
        this.isAddressLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isAddressLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  onAvatarUploaded(event: any): void {
    if (event?.imagePath) {
      this.profileImagePath = event.imagePath;
      this.cdRef.detectChanges();
    }
  }

  avatarUrl(): string {
    if (this.profileImagePath) {
      return `${environment.apis.default.url}/${this.profileImagePath}`;
    }
    return 'assets/media/avatars/blank.png';
  }

  saveProfile(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) return;

    const v = this.profileForm.value;
    const payload: any = {
      firstName: v.firstName,
      lastName: v.lastName,
      phoneNumber: v.phoneNumber,
      imagePath: this.profileImagePath || undefined,
    };
    if (v.currentPassword) payload.currentPassword = v.currentPassword;
    if (v.newPassword) payload.newPassword = v.newPassword;

    this.isSavingProfile = true;
    this.subs.sink = this.http
      .put(`${environment.apis.default.url}/api/profile`, payload)
      .subscribe({
        next: () => {
          this.isSavingProfile = false;
          this.profileForm.patchValue({ currentPassword: '', newPassword: '' });
          Swal.fire('Success', 'Profile updated successfully.', 'success');
          this.loadProfile();
        },
        error: () => {
          this.isSavingProfile = false;
          Swal.fire('Failed', 'Failed to update profile.', 'error');
        },
      });
  }

  isInvalid(name: string): boolean {
    const c = this.profileForm.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  openAddressModal(address?: UserAddressDto): void {
    const modalRef = this.modalService.open(AddressModalComponent, { size: 'md' });
    modalRef.componentInstance.address = address;
    modalRef.result.then(
      (result: string) => { if (result === 'success') this.loadAddresses(); },
      () => {}
    );
  }

  deleteAddress(id: number): void {
    Swal.fire({
      title: 'Delete Address?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.subs.sink = this.addressProxy.delete(id).subscribe({
        next: () => {
          Swal.fire('Deleted', 'Address deleted.', 'success');
          this.loadAddresses();
        },
        error: () => Swal.fire('Failed', 'Failed to delete address.', 'error'),
      });
    });
  }

  getAddressTypeLabel(type: any): string {
    return EnumLabelUtils.getAddressTypeLabel(type);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
