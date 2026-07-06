import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './features/auth/services/auth.guard';
import { BkashCancelledComponent } from './features/bkash-result/bkash-cancelled/bkash-cancelled.component';
import { BkashFailedComponent } from './features/bkash-result/bkash-failed/bkash-failed.component';
import { BkashSuccessComponent } from './features/bkash-result/bkash-success/bkash-success.component';

export const routes: Routes = [
  // Public bKash result pages — registered here (ahead of the AuthGuard-protected shell below)
  // as exact literal paths so they render unconditionally, even if the customer's session
  // lapsed while they were on bKash's hosted checkout page (a real full browser redirect, not
  // an in-app navigation). These exact strings intentionally match the FrontendSuccessUrl/
  // FrontendFailureUrl/FrontendCancelUrl paths configured on the backend — do not rename without
  // updating that configuration too.
  { path: 'orders/bkash-success', component: BkashSuccessComponent },
  { path: 'orders/bkash-failed', component: BkashFailedComponent },
  { path: 'orders/bkash-cancelled', component: BkashCancelledComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'terms-and-conditions',
    loadChildren: () =>
      import('./features/terms/terms.module').then((m) => m.TermsModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./features/public/about/about.module').then((m) => m.AboutModule),
  },
  {
    path: 'contact-us',
    loadChildren: () =>
      import('./features/public/contact-us/contact-us.module').then((m) => m.ContactUsModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./features/public/privacy-policy/privacy-policy.module').then((m) => m.PrivacyPolicyModule),
  },
  {
    path: 'track-order',
    loadChildren: () =>
      import('./features/track-order/track-order.module').then((m) => m.TrackOrderModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./_metronic/layout/layout.module').then((m) => m.LayoutModule),
  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'disabled',
      anchorScrolling: 'disabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
