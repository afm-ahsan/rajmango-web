import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { PolicyDto } from '../models/policy.model';
import { PolicyService } from '../policy.service';

const SLUG_TO_TYPE: Record<string, number> = {
  order: 0,
  payment: 1,
  refund: 2,
  delivery: 3,
  complaint: 4,
  privacy: 5,
};

@Component({
  selector: 'app-policy-detail',
  templateUrl: './policy-detail.component.html',
})
export class PolicyDetailComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  policy: PolicyDto | null = null;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private policyService: PolicyService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.route.paramMap.subscribe(params => {
      const slug = params.get('type') ?? '';
      const type = SLUG_TO_TYPE[slug];
      if (type === undefined) {
        this.router.navigate(['/policies/view']);
        return;
      }
      this.load(type);
    });
  }

  load(policyType: number): void {
    this.isLoading = true;
    this.notFound = false;
    this.policy = null;
    this.subs.sink = this.policyService.getByType(policyType).subscribe({
      next: (res: any) => {
        this.policy = res?.data ?? null;
        this.notFound = !this.policy;
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.notFound = true;
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/policies/view']);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
