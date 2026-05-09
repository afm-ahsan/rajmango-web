import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { PaymentTypeService } from '../payment-type.service';
import { PaymentMethodDto } from '../models/payment-method-dto.model';

@Component({
  selector: 'app-view-payment-type-modal',
  templateUrl: './view-payment-type-modal.component.html',
  styleUrls: ['./view-payment-type-modal.component.scss'],
})
export class ViewPaymentTypeModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  subs = new SubSink();
  isLoading = false;
  paymentMethodDto: PaymentMethodDto = {} as PaymentMethodDto;

  constructor(
    public modal: NgbActiveModal,
    private paymentTypeService: PaymentTypeService
  ) {}

  ngOnInit(): void {
    this.loadExpenseType();
  }

  loadExpenseType() {
    this.isLoading = true;
    this.subs.sink = this.paymentTypeService.getItem(this.id).subscribe(
      (paymentMethodDto: any) => {
        this.paymentMethodDto = paymentMethodDto.data;
        this.isLoading = false;
      },
      (error: any) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
