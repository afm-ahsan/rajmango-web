import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { SignalRService } from 'src/app/shared/services/signalr.service';
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
    private signalR: SignalRService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
    this.subs.sink = this.signalR.complaintStatusUpdated$.subscribe((p) => {
      this.load();
      Swal.fire({
        toast: true, position: 'top-end', icon: 'info',
        title: `Complaint #${p.complaintId} status updated to: ${p.status}`,
        showConfirmButton: false, timer: 4000, timerProgressBar: true,
      });
    });
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.complaintService.getMine().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      })
    ).subscribe({
      next: (res: any) => {
        this.complaints = res?.data ?? [];
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
