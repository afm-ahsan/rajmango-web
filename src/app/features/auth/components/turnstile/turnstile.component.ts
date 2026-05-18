import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

declare const window: any;

@Component({
  selector: 'app-turnstile',
  template: '<div #container style="width:100%"></div>',
  styles: [':host { display: block; width: 100%; }'],
})
export class TurnstileComponent implements AfterViewInit, OnDestroy {
  @Input() siteKey!: string;
  @Input() theme: 'light' | 'dark' | 'auto' = 'light';
  @Input() size: 'normal' | 'compact' | 'flexible' = 'normal';
  @Output() resolved   = new EventEmitter<string>();
  @Output() errored    = new EventEmitter<void>();
  @Output() loadFailed = new EventEmitter<void>();
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  private widgetId?: string;
  private retryCount = 0;
  private readonly maxRetries = 50; // 10 s at 200 ms
  private destroyed = false;

  constructor(
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.tryRender();
  }

  reset(): void {
    if (typeof window.turnstile !== 'undefined' && this.widgetId !== undefined) {
      window.turnstile.reset(this.widgetId);
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (typeof window.turnstile !== 'undefined' && this.widgetId !== undefined) {
      window.turnstile.remove(this.widgetId);
    }
  }

  private tryRender(): void {
    if (this.destroyed) return;

    if (typeof window.turnstile !== 'undefined') {
      this.widgetId = window.turnstile.render(this.containerRef.nativeElement, {
        sitekey: this.siteKey,
        theme: this.theme,
        size: this.size,
        callback: (token: string) => {
          this.ngZone.run(() => {
            this.resolved.emit(token);
            this.cdRef.detectChanges();
          });
        },
        'error-callback': () => {
          this.ngZone.run(() => {
            this.errored.emit();
            this.cdRef.detectChanges();
          });
        },
        'expired-callback': () => {
          this.ngZone.run(() => {
            this.errored.emit();
            this.cdRef.detectChanges();
          });
        },
      });
    } else if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => this.tryRender(), 200);
    } else {
      // Script never loaded after 10 s
      this.ngZone.run(() => {
        this.loadFailed.emit();
        this.cdRef.detectChanges();
      });
    }
  }
}
