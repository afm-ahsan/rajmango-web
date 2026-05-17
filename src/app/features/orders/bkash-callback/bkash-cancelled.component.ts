import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bkash-cancelled',
  templateUrl: './bkash-cancelled.component.html',
})
export class BkashCancelledComponent {
  constructor(private router: Router) {}

  goToOrders(): void {
    this.router.navigate(['/orders/order-list']);
  }
}
