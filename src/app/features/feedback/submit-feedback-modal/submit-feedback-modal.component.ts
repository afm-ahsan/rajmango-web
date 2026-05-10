import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FeedbackService } from '../feedback.service';

@Component({
  selector: 'app-submit-feedback-modal',
  templateUrl: './submit-feedback-modal.component.html',
})
export class SubmitFeedbackModalComponent implements OnInit {
  @Input() orderId!: number;
  @Input() orderNumber!: string;

  form!: FormGroup;
  isSaving = false;
  selectedRating = 0;
  uploadedImagePaths: string[] = [];

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      note: ['', Validators.maxLength(500)],
    });
  }

  onImagesChanged(paths: string[]): void {
    this.uploadedImagePaths = paths;
  }

  setRating(value: number): void {
    this.selectedRating = value;
    this.form.patchValue({ rating: value });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.feedbackService.submit({
      orderId: this.orderId,
      rating: this.form.value.rating,
      note: this.form.value.note,
      imagePaths: this.uploadedImagePaths.length ? this.uploadedImagePaths : undefined,
    }).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res?.succeeded) {
          Swal.fire({ icon: 'success', title: 'Thank you!', text: 'Your feedback has been submitted.', timer: 2000, showConfirmButton: false });
          this.modal.close('success');
        } else {
          Swal.fire({ icon: 'error', title: 'Failed', text: res?.messages?.[0] ?? 'Could not submit feedback.' });
        }
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isSaving = false;
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong.' });
        this.cdRef.detectChanges();
      },
    });
  }
}
