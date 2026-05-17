import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './features/auth/services/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./features/errors/errors.module').then((m) => m.ErrorsModule),
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
