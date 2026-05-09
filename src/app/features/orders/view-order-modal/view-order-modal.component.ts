import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { SubSink } from 'subsink';
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
  private subs = new SubSink();

  constructor(
    public modal: NgbActiveModal,
    private orderService: OrderService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private loadOrder(): void {
    this.isLoading = true;
    this.loaderService.show();

    this.subs.sink = this.orderService.getById(this.id).subscribe({
      next: (response) => {
        this.orderDto = response.data;
        this.enrichOrderDetails();
        this.isLoading = false;
        this.loaderService.hide();
      },
      error: (error) => {
        console.error('Failed to load order:', error);
        this.isLoading = false;
        this.loaderService.hide();
      }
    });
  }

  private enrichOrderDetails(): void {
    if (!this.orderDto.orderDetails) return;

    this.orderDto.orderDetails = this.orderDto.orderDetails.map(detail => ({
      ...detail,
      mangoName: EnumLabelUtils.getMangoTypeLabel(detail.mangoTypeId),
      crateName: EnumLabelUtils.getCrateTypeLabel(detail.crateType)
    }));
  }
}
