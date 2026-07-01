import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bkash-success',
  templateUrl: './bkash-success.component.html',
})
export class BkashSuccessComponent implements OnInit {
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
