import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SubSink } from 'subsink';
import { MangoAvailabilityDto, MangoAvailabilityServiceProxy } from 'src/app/services/client-proxy';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { AvailabilityModalComponent } from '../availability-modal/availability-modal.component';

@Component({
  selector: 'app-availability-list',
  templateUrl: './availability-list.component.html',
})
export class AvailabilityListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  items: MangoAvailabilityDto[] = [];

  constructor(
    private proxy: MangoAvailabilityServiceProxy,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.proxy.get().subscribe({
      next: (res: any) => {
        this.items = res?.data ?? [];
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  openModal(item?: MangoAvailabilityDto): void {
    const modalRef = this.modalService.open(AvailabilityModalComponent, { size: 'lg' });
    modalRef.componentInstance.item = item;
    modalRef.result.then(
      (result: string) => { if (result === 'success') this.load(); },
      () => {}
    );
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Delete Availability Record?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.subs.sink = this.proxy.delete(id).subscribe({
        next: () => {
          Swal.fire('Deleted', 'Record deleted.', 'success');
          this.load();
        },
        error: () => Swal.fire('Failed', 'Failed to delete record.', 'error'),
      });
    });
  }

  getStatusLabel(status: any): string {
    return EnumLabelUtils.getMangoAvailabilityStatusLabel(status);
  }

  getStatusClass(status: any): string {
    const map: Record<number, string> = {
      0: 'badge-light-info',
      1: 'badge-light-success',
      2: 'badge-light-warning',
      3: 'badge-light-danger',
    };
    return map[+status] ?? 'badge-light-secondary';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
