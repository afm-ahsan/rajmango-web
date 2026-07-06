import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BkashCancelledComponent } from './bkash-cancelled/bkash-cancelled.component';
import { BkashFailedComponent } from './bkash-failed/bkash-failed.component';
import { BkashSuccessComponent } from './bkash-success/bkash-success.component';

/**
 * Declares (does not route) the public bKash result pages. Registered as top-level routes in
 * app-routing.module.ts, ahead of the AuthGuard-protected shell, so they always render even if
 * the customer's session lapsed while they were on bKash's hosted checkout page.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [
    BkashSuccessComponent,
    BkashFailedComponent,
    BkashCancelledComponent,
  ],
})
export class BkashResultModule {}
