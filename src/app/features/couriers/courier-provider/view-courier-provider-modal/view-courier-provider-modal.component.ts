import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, first, of } from 'rxjs';
import { SubSink } from 'subsink';

import { CourierProviderService } from '../courier-provider.service';
import { CourierProviderDto } from '../models/courier-provider-dto';

@Component({
  selector: 'app-view-courier-provider-modal',
  templateUrl: './view-courier-provider-modal.component.html',
  styleUrls: ['./view-courier-provider-modal.component.scss']
})
export class ViewCourierProviderModalComponent implements OnInit, OnDestroy {
  @Input() id!: number;

  courierProviderDto: CourierProviderDto = this.getDefaultProvider();
  isLoading = false;
  private subs = new SubSink();

  constructor(
    public modal: NgbActiveModal,
    private courierProviderService: CourierProviderService
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.fetchCourierProvider();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private fetchCourierProvider(): void {
    this.isLoading = true;
    this.subs.sink = this.courierProviderService.getById(this.id)
      .pipe(
        first(),
        catchError((error) => {
          console.error('Failed to fetch courier provider:', error);
          return of({ data: this.getDefaultProvider() });
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((response: any) => {
        this.courierProviderDto = response.data;
      });
  }

  private getDefaultProvider(): CourierProviderDto {
    return {
      id: 0,
      name: '',
      description: '',
      supportPhone: '',
      email: '',
      isActive: false
    };
  }
}
