import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BkashPaymentResultDto, BkashResultService } from '../bkash-result.service';

@Component({
  selector: 'app-bkash-success',
  templateUrl: './bkash-success.component.html',
})
export class BkashSuccessComponent implements OnInit {
  isLoading = true;
  paymentId = '';
  result: BkashPaymentResultDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bkashResultService: BkashResultService,
  ) {}

  ngOnInit(): void {
    this.paymentId =
      this.route.snapshot.queryParamMap.get('paymentId') ||
      this.route.snapshot.queryParamMap.get('paymentID') ||
      '';

    if (!this.paymentId) {
      this.isLoading = false;
      return;
    }

    this.bkashResultService.getResult(this.paymentId).pipe(
      finalize(() => { this.isLoading = false; })
    ).subscribe({
      next: (res) => { this.result = res?.succeeded ? (res.data ?? null) : null; },
      error: () => { this.result = null; },
    });
  }

  viewOrders(): void {
    this.router.navigate(['/orders/order-list']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
