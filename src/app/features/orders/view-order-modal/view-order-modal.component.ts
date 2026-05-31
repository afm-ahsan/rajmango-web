import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { UserPermissionKey } from 'src/app/core/constants/user-permission-keys.enum';
import { UserPermissionService } from 'src/app/features/auth/services/user-permission.service';
import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { ReceiverType } from 'src/app/shared/enums/receiver-type.enum';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { OrderDto } from '../models/order-dto.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-view-order-modal',
  templateUrl: './view-order-modal.component.html',
  styleUrls: ['./view-order-modal.component.scss']
})
export class ViewOrderModalComponent implements OnInit, OnDestroy {
  @Input() id!: number;
  @Input() orders: OrderDto[] = [];

  orderDto: OrderDto = {} as OrderDto;
  isLoading = false;
  readonly ReceiverType = ReceiverType;

  // Admin override state
  overrideAmount: number | null = null;
  overrideNote = '';
  isSavingOverride = false;
  overrideSaveError: string | null = null;

  private subs = new SubSink();

  constructor(
    public modal: NgbActiveModal,
    private orderService: OrderService,
    private permissionService: UserPermissionService,
    private cdRef: ChangeDetectorRef
  ) {}

  get isAdmin(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasAdminAccess);
  }

  ngOnInit(): void {
    this.loadOrder();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private loadOrder(): void {
    this.isLoading = true;
    this.subs.sink = this.orderService.getById(this.id).subscribe({
      next: (response) => {
        this.orderDto = response.data;
        this.enrichOrderDetails();
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  private enrichOrderDetails(): void {
    if (!this.orderDto.orderDetails) return;
    this.orderDto.orderDetails = this.orderDto.orderDetails.map(detail => ({
      ...detail,
      mangoName: detail.mangoName ?? '—',
      crateName: EnumLabelUtils.getCrateTypeLabel(detail.crateType)
    }));
  }

  saveOverride(): void {
    const overrideAmount = this.overrideAmount;
    if (overrideAmount == null) return;
    this.overrideSaveError = null;
    this.isSavingOverride = true;

    this.subs.sink = this.orderService.overrideCourierCharge(this.id, {
      overrideAmount,
      note: this.overrideNote
    }).pipe(
      finalize(() => { this.isSavingOverride = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: () => {
        Swal.fire({ title: 'Saved', text: 'Courier charge override saved.', icon: 'success', heightAuto: false, scrollbarPadding: false });
        this.loadOrder();
      },
      error: (err) => {
        this.overrideSaveError = err?.error?.messages?.join(' ') ?? 'Failed to save courier charge override.';
        this.cdRef.detectChanges();
      }
    });
  }

  getOrderStatusLabel(status: OrderStatus): string {
    return EnumLabelUtils.getOrderStatusLabel(status);
  }

  getOrderStatusBadgeClass(status: OrderStatus): string {
    return EnumLabelUtils.getOrderStatusBadgeClass(status);
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    return EnumLabelUtils.getPaymentStatusLabel(status);
  }

  getPaymentStatusBadgeClass(status: PaymentStatus): string {
    return EnumLabelUtils.getPaymentStatusBadgeClass(status);
  }

  getDeliveryStatusLabel(status: DeliveryStatus): string {
    return EnumLabelUtils.getDeliveryStatusLabel(status);
  }

  getDeliveryStatusBadgeClass(status: DeliveryStatus): string {
    return EnumLabelUtils.getDeliveryStatusBadgeClass(status);
  }
}
