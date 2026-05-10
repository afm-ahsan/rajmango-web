import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { GetAllPaymentDto, PaymentServiceProxy } from 'src/app/services/client-proxy';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { SignalRService } from 'src/app/shared/services/signalr.service';
import { RecordPaymentModalComponent } from '../record-payment-modal/record-payment-modal.component';
import { ViewPaymentModalComponent } from '../view-payment-modal/view-payment-modal.component';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
})
export class PaymentListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  payments: GetAllPaymentDto[] = [];
  searchVal = '';

  constructor(
    private paymentProxy: PaymentServiceProxy,
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
    this.subs.sink = this.paymentProxy.get().subscribe({
      next: (res: any) => {
        this.payments = res?.data ?? [];
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  get filteredPayments(): GetAllPaymentDto[] {
    const term = this.searchVal.toLowerCase().trim();
    if (!term) return this.payments;
    return this.payments.filter(p =>
      p.orderId?.toString().includes(term) ||
      p.transactionId?.toLowerCase().includes(term)
    );
  }

  record(orderId = 0): void {
    const modalRef = this.modalService.open(RecordPaymentModalComponent, { size: 'md' });
    modalRef.componentInstance.orderId = orderId;
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
