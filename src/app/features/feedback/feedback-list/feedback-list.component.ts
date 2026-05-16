import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import { FeedbackDto } from '../models/feedback.model';
import { FeedbackService } from '../feedback.service';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
})
export class FeedbackListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  feedbacks: FeedbackDto[] = [];

  constructor(
    private feedbackService: FeedbackService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.feedbackService.getAll().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      })
    ).subscribe({
      next: (res: any) => {
        this.feedbacks = res?.data ?? [];
      },
    });
  }

  stars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
