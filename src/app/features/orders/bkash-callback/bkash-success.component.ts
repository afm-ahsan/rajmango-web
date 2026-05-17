import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bkash-success',
  templateUrl: './bkash-success.component.html',
})
export class BkashSuccessComponent {
  constructor(private router: Router) {}

  goToOrders(): void {
    this.router.navigate(['/orders/order-list']);
  }
}
