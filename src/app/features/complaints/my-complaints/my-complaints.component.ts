import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { ComplaintService } from '../complaint.service';
import { ComplaintDto } from '../models/complaint.model';
import { SubmitComplaintModalComponent } from '../submit-complaint-modal/submit-complaint-modal.component';

@Component({
  selector: 'app-my-complaints',
  templateUrl: './my-complaints.component.html',
})
export class MyComplaintsComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  complaints: ComplaintDto[] = [];

  constructor(
    private complaintService: ComplaintService,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.complaintService.getMine().subscribe({
      next: (res: any) => {
        this.complaints = res?.data ?? [];
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  openSubmit(): void {
    const ref = this.modalService.open(SubmitComplaintModalComponent, { size: 'md' });
    ref.result.then((result) => {
      if (result === 'submitted') this.load();
    }, () => {});
  }

  getCategoryLabel(cat: any): string { return EnumLabelUtils.getComplaintCategoryLabel(cat); }
  getStatusLabel(status: any): string { return EnumLabelUtils.getComplaintStatusLabel(status); }
  getStatusBadge(status: any): string { return EnumLabelUtils.getComplaintStatusBadgeClass(status); }

  ngOnDestroy(): void { this.subs.unsubscribe(); }
}
