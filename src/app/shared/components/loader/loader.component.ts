import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loaderService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.isLoading = value;
        this.cdr.detectChanges(); // or cdr.markForCheck() if using OnPush strategy
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
