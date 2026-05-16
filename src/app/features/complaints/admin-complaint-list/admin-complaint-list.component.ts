import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { SignalRService } from 'src/app/shared/services/signalr.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ComplaintService } from '../complaint.service';
import { ComplaintDto } from '../models/complaint.model';
import { UpdateStatusModalComponent } from '../update-status-modal/update-status-modal.component';

@Component({
  selector: 'app-admin-complaint-list',
  templateUrl: './admin-complaint-list.component.html',
})
export class AdminComplaintListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  complaints: ComplaintDto[] = [];

  constructor(
    private complaintService: ComplaintService,
    private modalService: NgbModal,
    private loaderService: LoaderService,
    private signalR: SignalRService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
    this.subs.sink = this.signalR.complaintSubmitted$.subscribe(() => this.load());
    this.subs.sink = this.signalR.complaintStatusUpdated$.subscribe(() => this.load());
  }

  load(): void {
    this.isLoading = true;
    this.loaderService.show();
    this.subs.sink = this.complaintService.getAll().pipe(
      finalize(() => {
        this.isLoading = false;
        this.loaderService.hide();
        this.cdRef.detectChanges();
      })
    ).subscribe({
      next: (res: any) => {
        this.complaints = res?.data ?? [];
      },
    });
  }

  openUpdateStatus(complaint: ComplaintDto): void {
    const ref = this.modalService.open(UpdateStatusModalComponent, { size: 'md' });
    ref.componentInstance.complaint = complaint;
    ref.result.then((result) => {
      if (result === 'updated') this.load();
    }, () => {});
  }

  getCategoryLabel(cat: any): string { return EnumLabelUtils.getComplaintCategoryLabel(cat); }
  getStatusLabel(status: any): string { return EnumLabelUtils.getComplaintStatusLabel(status); }
  getStatusBadge(status: any): string { return EnumLabelUtils.getComplaintStatusBadgeClass(status); }

  ngOnDestroy(): void { this.subs.unsubscribe(); }
}
