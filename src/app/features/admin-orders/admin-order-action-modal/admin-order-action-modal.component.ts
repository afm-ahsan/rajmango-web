import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { OrderService } from '../../orders/order.service';

export type AdminOrderAction = 'confirm' | 'process' | 'ship' | 'deliver' | 'cancel';

@Component({
  selector: 'app-admin-order-action-modal',
  templateUrl: './admin-order-action-modal.component.html',
})
export class AdminOrderActionModalComponent implements OnDestroy {
  @Input() orderId!: number;
  @Input() orderNumber!: string;
  @Input() action!: AdminOrderAction;

  trackingNumber = '';
  isSaving = false;
  errorMessage: string | null = null;

  private subs = new SubSink();

  constructor(
    public modal: NgbActiveModal,
    private orderService: OrderService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get actionLabel(): string {
    const labels: Record<AdminOrderAction, string> = {
      confirm: 'Confirm',
      process: 'Move to Processing',
      ship:    'Mark as Shipped',
      deliver: 'Mark as Delivered',
      cancel:  'Cancel',
    };
    return labels[this.action] ?? this.action;
  }

  get actionDescription(): string {
    const descs: Record<AdminOrderAction, string> = {
      confirm: `Confirm order ${this.orderNumber}?`,
      process: `Move order ${this.orderNumber} to processing?`,
      ship:    `Mark order ${this.orderNumber} as shipped?`,
      deliver: `Mark order ${this.orderNumber} as delivered? Payment must be complete.`,
      cancel:  `Cancel order ${this.orderNumber}? This cannot be undone.`,
    };
    return descs[this.action] ?? '';
  }

  get isCancelAction(): boolean {
    return this.action === 'cancel';
  }

  get isShipAction(): boolean {
    return this.action === 'ship';
  }

  submit(): void {
    this.errorMessage = null;
    this.isSaving = true;

    const call$ = this.buildCall();
    if (!call$) return;

    this.subs.sink = call$.pipe(
      finalize(() => { this.isSaving = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (res: any) => {
        if (res?.succeeded === false) {
          this.errorMessage = res?.messages?.join(' ') ?? 'Action failed.';
          return;
        }
        Swal.fire({
          title: 'Done',
          text: `Order ${this.orderNumber} updated.`,
          icon: 'success',
          heightAuto: false,
          scrollbarPadding: false,
        });
        this.modal.close('success');
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.messages?.join(' ') ?? 'Action failed. Please try again.';
        this.cdRef.detectChanges();
      }
    });
  }

  private buildCall() {
    switch (this.action) {
      case 'confirm': return this.orderService.adminConfirm(this.orderId);
      case 'process': return this.orderService.adminProcess(this.orderId);
      case 'ship':    return this.orderService.adminShip(this.orderId, this.trackingNumber || null);
      case 'deliver': return this.orderService.adminDeliver(this.orderId);
      case 'cancel':  return this.orderService.adminCancel(this.orderId);
      default: return null;
    }
  }
}
