import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import { AdminDashboardDto, DashboardServiceProxy } from 'src/app/services/client-proxy';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SignalRService } from 'src/app/shared/services/signalr.service';

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
    private loaderService: LoaderService,
    private signalR: SignalRService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
    this.subscribeToRealtime();
  }

  load(): void {
    this.isLoading = true;
    this.loaderService.show();
    this.subs.sink = this.dashboardProxy.getAdminDashboard().pipe(
      finalize(() => {
        this.isLoading = false;
        this.loaderService.hide();
        this.cdRef.detectChanges();
      })
    ).subscribe({
      next: (res: any) => {
        this.dashboard = res?.data ?? null;
      },
    });
  }

  private subscribeToRealtime(): void {
    // Reload on any event that changes admin dashboard counters
    this.subs.sink = this.signalR.orderCreated$.subscribe(() => this.load());
    this.subs.sink = this.signalR.orderStatusUpdated$.subscribe(() => this.load());
    this.subs.sink = this.signalR.paymentReceived$.subscribe(() => this.load());
    this.subs.sink = this.signalR.complaintSubmitted$.subscribe(() => this.load());
    this.subs.sink = this.signalR.complaintStatusUpdated$.subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
