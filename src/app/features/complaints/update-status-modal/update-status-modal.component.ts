import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ComplaintStatus } from 'src/app/shared/enums/complaint-status.enum';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { ComplaintService } from '../complaint.service';
import { ComplaintDto } from '../models/complaint.model';

@Component({
  selector: 'app-update-status-modal',
  templateUrl: './update-status-modal.component.html',
})
export class UpdateStatusModalComponent implements OnInit {
  @Input() complaint!: ComplaintDto;

  form!: FormGroup;
  isSaving = false;

  statusOptions = [
    { value: ComplaintStatus.Submitted, label: 'Submitted' },
    { value: ComplaintStatus.UnderReview, label: 'Under Review' },
    { value: ComplaintStatus.Resolved, label: 'Resolved' },
    { value: ComplaintStatus.Rejected, label: 'Rejected' },
    { value: ComplaintStatus.Closed, label: 'Closed' },
  ];

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private complaintService: ComplaintService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      status: [this.complaint.status, Validators.required],
      adminNote: [this.complaint.adminNote ?? '', Validators.maxLength(500)],
    });
  }

  getCategoryLabel(cat: any): string { return EnumLabelUtils.getComplaintCategoryLabel(cat); }

  save(): void {
    if (this.form.invalid) return;
    this.isSaving = true;
    this.complaintService.updateStatus(this.complaint.id, {
      id: this.complaint.id,
      status: +this.form.value.status,
      adminNote: this.form.value.adminNote,
    }).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res?.succeeded) {
          Swal.fire({ icon: 'success', title: 'Updated', timer: 1500, showConfirmButton: false });
          this.modal.close('updated');
        } else {
          Swal.fire({ icon: 'error', title: 'Failed', text: res?.messages?.[0] ?? 'Could not update.' });
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
