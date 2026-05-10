import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MangoAvailabilityDto, MangoAvailabilityServiceProxy } from 'src/app/services/client-proxy';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
})
export class CatalogListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  catalog: MangoAvailabilityDto[] = [];

  constructor(
    private proxy: MangoAvailabilityServiceProxy,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.proxy.getActive().subscribe({
      next: (res) => {
        this.catalog = res.data ?? [];
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  getStatusLabel(status: number): string {
    return EnumLabelUtils.getMangoAvailabilityStatusLabel(status);
  }

  getStatusBadgeClass(status: number): string {
    const classes: Record<number, string> = {
      0: 'badge-light-primary',
      1: 'badge-light-success',
      2: 'badge-light-warning',
      3: 'badge-light-danger',
    };
    return classes[status] ?? 'badge-light-secondary';
  }

  placeOrder(): void {
    this.router.navigate(['/orders/order-list']);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
