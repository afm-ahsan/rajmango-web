import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bkash-failed',
  templateUrl: './bkash-failed.component.html',
})
export class BkashFailedComponent {
  constructor(private router: Router) {}

  goToOrders(): void {
    this.router.navigate(['/orders/order-list']);
  }
}
