import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ComplaintCategory } from 'src/app/shared/enums/complaint-category.enum';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { ComplaintService } from '../complaint.service';

@Component({
  selector: 'app-submit-complaint-modal',
  templateUrl: './submit-complaint-modal.component.html',
})
export class SubmitComplaintModalComponent implements OnInit {
  @Input() orderId: number = 0;
  @Input() orderNumber: string = '';

  form!: FormGroup;
  isSaving = false;

  categoryOptions = [
    { value: ComplaintCategory.WrongItem, label: EnumLabelUtils.getComplaintCategoryLabel(ComplaintCategory.WrongItem) },
    { value: ComplaintCategory.DamagedItem, label: EnumLabelUtils.getComplaintCategoryLabel(ComplaintCategory.DamagedItem) },
    { value: ComplaintCategory.LateDelivery, label: EnumLabelUtils.getComplaintCategoryLabel(ComplaintCategory.LateDelivery) },
    { value: ComplaintCategory.MissingItem, label: EnumLabelUtils.getComplaintCategoryLabel(ComplaintCategory.MissingItem) },
    { value: ComplaintCategory.PaymentIssue, label: EnumLabelUtils.getComplaintCategoryLabel(ComplaintCategory.PaymentIssue) },
    { value: ComplaintCategory.QualityIssue, label: EnumLabelUtils.getComplaintCategoryLabel(ComplaintCategory.QualityIssue) },
    { value: ComplaintCategory.Other, label: EnumLabelUtils.getComplaintCategoryLabel(ComplaintCategory.Other) },
  ];

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private complaintService: ComplaintService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      orderId: [this.orderId, [Validators.required, Validators.min(1)]],
      category: [ComplaintCategory.WrongItem, Validators.required],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    this.complaintService.submit({
      orderId: +this.form.value.orderId,
      category: +this.form.value.category,
      description: this.form.value.description,
    }).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res?.succeeded) {
          Swal.fire({ icon: 'success', title: 'Submitted', text: 'Your complaint has been submitted.', timer: 2000, showConfirmButton: false });
          this.modal.close('submitted');
        } else {
          Swal.fire({ icon: 'error', title: 'Failed', text: res?.messages?.[0] ?? 'Could not submit complaint.' });
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
