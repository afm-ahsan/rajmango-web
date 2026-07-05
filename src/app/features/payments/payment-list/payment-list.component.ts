import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { FilterUtils } from 'src/app/shared/utils/filter-utils';
import { SubSink } from 'subsink';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { SignalRService } from 'src/app/shared/services/signalr.service';
import { PaymentService } from '../payment.service';
import { RecordPaymentModalComponent } from '../record-payment-modal/record-payment-modal.component';
import { ViewPaymentModalComponent } from '../view-payment-modal/view-payment-modal.component';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
})
export class PaymentListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  payments: any[] = [];
  totalCount = 0;
  searchVal = '';
  filter: FilterModel = {
    offset: 0,
    limit: 0,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    isDesc: true,
    userId: 0
  };

  constructor(
    private paymentService: PaymentService,
    private modalService: NgbModal,
    private signalR: SignalRService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
    this.subs.sink = this.signalR.paymentReceived$.subscribe(() => this.load());
  }

  load(): void {
    this.isLoading = true;
    const dto = FilterUtils.createPagedRequest(this.filter, this.searchVal);
    this.subs.sink = this.paymentService.getAll(dto).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
        MenuComponent.reinitialization();
      })
    ).subscribe({
      next: (response: any) => {
        this.payments = response.data ?? [];
        this.totalCount = response.totalCount ?? this.payments.length;
      },
    });
  }

  onSearchChange(event: Event): void {
    this.searchVal = (event.target as HTMLInputElement).value;
    this.filter.pageNumber = 1;
    this.load();
  }

  record(): void {
    const modalRef = this.modalService.open(RecordPaymentModalComponent, { size: 'lg' });
    modalRef.result.then(
      (result: string) => { if (result === 'success') this.load(); },
      () => {}
    );
  }

  view(id: number): void {
    const modalRef = this.modalService.open(ViewPaymentModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => {}, () => {});
  }

  pageChanged($event: any): void {
    this.filter.pageNumber = $event;
    this.load();
  }

  pageSizeChanged($event: any): void {
    this.filter.pageNumber = 1;
    this.filter.pageSize = $event;
    this.load();
  }

  getPaymentStatusLabel(status: any): string {
    return EnumLabelUtils.getPaymentStatusLabel(status);
  }

  getPaymentMethodLabel(method: any): string {
    return EnumLabelUtils.getPaymentMethodLabel(method);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
