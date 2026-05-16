import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SubSink } from 'subsink';
import {
  MyProfileDto,
  ProfileServiceProxy,
  UpdateMyProfileCommand,
  UserAddressDto,
  UserAddressServiceProxy,
} from 'src/app/services/client-proxy';
import { FileService } from 'src/app/shared/services/file-service.service';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { AddressModalComponent } from '../address-modal/address-modal.component';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/features/auth';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isProfileLoading = false;
  isSavingProfile = false;
  isAddressLoading = false;

  // Avatar upload state
  isUploadingPhoto = false;
  photoError = '';
  avatarLoadError = false;

  profile: MyProfileDto | null = null;
  addresses: UserAddressDto[] = [];
  profileForm: FormGroup;
  profileImagePath = '';

  // Path of the previous photo to delete after a successful replacement save.
  // Fire-and-forget; failures are logged but never surface to the user.
  private _oldImagePathToClean = '';

  /** True only when a non-empty server-side image path is stored. */
  get hasProfilePhoto(): boolean {
    return !!this.profileImagePath?.trim();
  }

  constructor(
    private fb: FormBuilder,
    private profileProxy: ProfileServiceProxy,
    private addressProxy: UserAddressServiceProxy,
    private fileService: FileService,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService
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
          this.profileImagePath = this.profile.imagePath ?? '';
          this.avatarLoadError = false;
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

  // ── Avatar: upload ──────────────────────────────────────────────────────────

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    input.value = ''; // allow re-selecting the same file

    // Remember the current path so we can delete it after the new one is saved.
    const previousPath = this.profileImagePath;

    this.isUploadingPhoto = true;
    this.photoError = '';

    const formData = new FormData();
    formData.append('file', file, file.name);

    this.subs.sink = this.fileService
      .upload(formData, { domain: 'users', prefix: 'profile' })
      .subscribe({
        next: (evt: any) => {
          if (evt.type === HttpEventType.Response) {
            const imagePath: string = evt.body?.imagePath;
            if (imagePath) {
              // Schedule old-file cleanup to run once the DB save succeeds.
              this._oldImagePathToClean = previousPath;
              this.profileImagePath = imagePath;
              this.avatarLoadError = false;
              this.isUploadingPhoto = false;
              this.cdRef.detectChanges();
              this.saveProfile();
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          this.photoError =
            err?.error?.message ?? err?.message ?? 'Photo upload failed.';
          this.isUploadingPhoto = false;
          this.cdRef.detectChanges();
        },
      });
  }

  // ── Avatar: remove ──────────────────────────────────────────────────────────

  removePhoto(): void {
    if (!this.profileImagePath?.trim()) return;

    Swal.fire({
      title: 'Remove Photo?',
      text: 'Your profile photo will be removed.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (!result.isConfirmed) return;

      const path = this.profileImagePath;
      this.photoError = '';

      this.subs.sink = this.fileService.delete(path).subscribe({
        next: () => {
          this.profileImagePath = '';
          this.avatarLoadError = false;
          this.cdRef.detectChanges();
          this.saveProfile();
        },
        error: (err: HttpErrorResponse) => {
          // Keep existing image; show what went wrong
          this.photoError =
            err?.error?.message ?? err?.message ?? 'Failed to remove photo.';
          this.cdRef.detectChanges();
        },
      });
    });
  }

  // ── Avatar: broken-image fallback ───────────────────────────────────────────

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null; // prevent infinite loop
    img.src = 'assets/media/avatars/blank.png';
    this.avatarLoadError = true;
  }

  avatarUrl(): string {
    if (this.avatarLoadError || !this.profileImagePath) {
      return 'assets/media/avatars/blank.png';
    }
    const clean = this.profileImagePath.startsWith('/')
      ? this.profileImagePath.slice(1)
      : this.profileImagePath;
    return `${environment.apis.default.url}/${clean}`;
  }

  // ── Profile form save ───────────────────────────────────────────────────────

  saveProfile(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) return;

    const v = this.profileForm.value;
    const payload: any = {
      firstName: v.firstName,
      lastName: v.lastName,
      phoneNumber: v.phoneNumber,
      // Send the actual path (including empty string).
      // Empty string tells the backend to clear the stored image path.
      // Absent/null would be ignored by the backend, leaving the old path in DB.
      imagePath: this.profileImagePath,
    };
    if (v.currentPassword) payload.currentPassword = v.currentPassword;
    if (v.newPassword) payload.newPassword = v.newPassword;

    this.isSavingProfile = true;
    const cmd = new UpdateMyProfileCommand(payload);
    this.subs.sink = this.profileProxy.update(cmd).subscribe({
      next: () => {
        this.isSavingProfile = false;
        this.profileForm.patchValue({ currentPassword: '', newPassword: '' });
        Swal.fire('Success', 'Profile updated successfully.', 'success');

        // Sync imagePath into auth state so header avatar updates immediately.
        const current = this.authService.currentUserValue;
        if (current) {
          this.authService.currentUserValue = {
            ...current,
            imagePath: this.profileImagePath || null,
          };
        }

        // Best-effort: delete the old physical file now that the new path is
        // persisted. A failure here is non-blocking — just log a warning.
        const oldPath = this._oldImagePathToClean;
        this._oldImagePathToClean = '';
        if (oldPath?.trim()) {
          this.fileService.delete(oldPath).subscribe({
            next: () => {},
            error: (err) =>
              console.warn('Old profile photo cleanup failed (non-blocking):', err),
          });
        }

        this.loadProfile();
      },
      error: () => {
        this._oldImagePathToClean = '';
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
