import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { CustomerService } from '../customer.service';
import { CustomerDto } from '../models/customer-dto.model';

@Component({
  selector: 'app-view-customer-modal',
  templateUrl: './view-customer-modal.component.html',
  styleUrls: ['./view-customer-modal.component.scss'],
})
export class ViewCustomerModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() customerType: string;
  subs = new SubSink();
  isLoading = false;
  customerDto: CustomerDto = {} as CustomerDto;

  constructor(
    public modal: NgbActiveModal,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadCustomer();
  }

  loadCustomer() {
    this.isLoading = true;
    this.subs.sink = this.customerService.getOne(this.id).subscribe(
      (customerDto: any) => {
        this.customerDto = customerDto.data;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.modal.dismiss();
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
