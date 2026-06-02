import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { AuthService } from 'src/app/features/auth';
import { UserPermissionService } from 'src/app/features/auth/services/user-permission.service';
import { UserPermissionKey } from 'src/app/core/constants/user-permission-keys.enum';
import { GlobalSearchService } from 'src/app/features/search/search.service';
import {
  GlobalSearchResult,
  OrderSearchItem,
  CustomerSearchItem,
  StationSearchItem,
  MangoSearchItem,
} from 'src/app/features/search/models/search-result.model';
import { MenuComponent } from 'src/app/_metronic/kt/components';

const EMPTY_RESULT: GlobalSearchResult = { orders: [], customers: [], courierStations: [], mangoes: [] };

@Component({
  selector: 'app-search-result-inner',
  templateUrl: './search-result-inner.component.html',
})
export class SearchResultInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @HostBinding('attr.data-kt-search-element') dataKtSearch = 'content';

  keyword = '';
  isSearching = false;
  hasSearched = false;
  isAdmin = false;

  results: GlobalSearchResult = { ...EMPTY_RESULT };
  recentSearches: string[] = [];

  private input$ = new Subject<string>();
  private subs = new SubSink();

  constructor(
    private searchService: GlobalSearchService,
    private auth: AuthService,
    private permissionService: UserPermissionService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.auth.currentUser$
      .pipe(filter(u => !!u))
      .subscribe(() => {
        this.isAdmin = this.permissionService.hasAccess(UserPermissionKey.HasAdminAccess);
        this.recentSearches = this.searchService.getRecentSearches();
        this.cdRef.detectChanges();
      });

    this.subs.sink = this.input$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length < 3) {
          // Reset without emitting — EMPTY prevents subscribe from running
          this.isSearching = false;
          this.hasSearched = false;
          this.results = { ...EMPTY_RESULT };
          this.cdRef.detectChanges();
          return EMPTY;
        }
        this.isSearching = true;
        this.cdRef.detectChanges();
        return this.searchService.search(term);
      })
    ).subscribe({
      next: (res: any) => {
        this.isSearching = false;
        this.hasSearched = true;
        this.results = (res?.data as GlobalSearchResult) ?? { ...EMPTY_RESULT };
        if (res?.succeeded && this.keyword.trim().length >= 3) {
          this.searchService.saveRecentSearch(this.keyword.trim());
          this.recentSearches = this.searchService.getRecentSearches();
        }
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isSearching = false;
        this.hasSearched = true;
        this.results = { ...EMPTY_RESULT };
        this.cdRef.detectChanges();
      },
    });
  }

  onInput(term: string): void {
    this.keyword = term;
    this.input$.next(term);
  }

  clearSearch(): void {
    this.keyword = '';
    this.hasSearched = false;
    this.isSearching = false;
    this.results = { ...EMPTY_RESULT };
    this.input$.next('');
    this.cdRef.detectChanges();
  }

  useRecent(term: string): void {
    this.keyword = term;
    this.input$.next(term);
  }

  removeRecent(term: string, event: Event): void {
    event.stopPropagation();
    this.searchService.removeRecentSearch(term);
    this.recentSearches = this.searchService.getRecentSearches();
    this.cdRef.detectChanges();
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  openOrder(order: OrderSearchItem): void {
    MenuComponent.hideDropdowns(undefined);
    if (this.isAdmin) {
      this.router.navigate(['/admin-orders/list'], { queryParams: { orderNumber: order.orderNumber } });
    } else {
      this.router.navigate(['/orders/order-list'], { queryParams: { filter: order.orderNumber } });
    }
  }

  openCustomer(_customer: CustomerSearchItem): void {
    MenuComponent.hideDropdowns(undefined);
    this.router.navigate(['/customers/customer-list']);
  }

  openStation(_station: StationSearchItem): void {
    MenuComponent.hideDropdowns(undefined);
    this.router.navigate(['/couriers/courier-station-list']);
  }

  openMango(_mango: MangoSearchItem): void {
    MenuComponent.hideDropdowns(undefined);
    this.router.navigate(['/mango-catalog/catalog']);
  }

  orderMangoes(): void {
    MenuComponent.hideDropdowns(undefined);
    this.router.navigate(['/orders/order-list'], { queryParams: { new: '1' } });
  }

  go(path: string): void {
    MenuComponent.hideDropdowns(undefined);
    this.router.navigate([path]);
  }

  // ── Computed ──────────────────────────────────────────────────────────────

  get totalResults(): number {
    return this.results.orders.length
      + this.results.customers.length
      + this.results.courierStations.length
      + this.results.mangoes.length;
  }

  get showInitial(): boolean {
    return this.keyword.length < 3 && !this.isSearching;
  }

  get showResults(): boolean {
    return this.keyword.length >= 3 && !this.isSearching && this.hasSearched;
  }

  orderStatusLabel(status: number): string {
    const labels: Record<number, string> = {
      0: 'Pending', 1: 'Confirmed', 2: 'Processing',
      3: 'Shipped',  4: 'Delivered', 5: 'Cancelled',
      6: 'Returned', 7: 'Failed',
    };
    return labels[status] ?? 'Unknown';
  }

  orderStatusClass(status: number): string {
    const classes: Record<number, string> = {
      0: 'badge-light-warning',   1: 'badge-light-info',    2: 'badge-light-primary',
      3: 'badge-light-info',      4: 'badge-light-success', 5: 'badge-light-danger',
      6: 'badge-light-secondary', 7: 'badge-light-danger',
    };
    return classes[status] ?? 'badge-light';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
