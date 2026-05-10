import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { AdminDashboardDto, DashboardServiceProxy } from 'src/app/services/client-proxy';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  dashboard: AdminDashboardDto | null = null;

  constructor(
    private dashboardProxy: DashboardServiceProxy,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.dashboardProxy.getAdminDashboard().subscribe({
      next: (res: any) => {
        this.dashboard = res?.data ?? null;
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
