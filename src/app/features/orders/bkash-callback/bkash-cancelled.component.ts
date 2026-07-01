import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bkash-cancelled',
  templateUrl: './bkash-cancelled.component.html',
})
export class BkashCancelledComponent implements OnInit {
  paymentId = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.paymentId =
      this.route.snapshot.queryParamMap.get('paymentId') ||
      this.route.snapshot.queryParamMap.get('paymentID') ||
      '';
  }

  goToOrders(): void {
    this.router.navigate(['/orders/order-list']);
  }
}
