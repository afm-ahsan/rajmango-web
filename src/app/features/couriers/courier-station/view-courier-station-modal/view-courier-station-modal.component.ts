import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, first, of } from 'rxjs';
import { SubSink } from 'subsink';
import { CourierStationService } from '../courier-station.service';
import { CourierStationDto } from '../models/courier-station-dto';

@Component({
  selector: 'app-view-courier-station-modal',
  templateUrl: './view-courier-station-modal.component.html',
  styleUrls: ['./view-courier-station-modal.component.scss']
})
export class ViewCourierStationModalComponent implements OnInit, OnDestroy {
  @Input() id!: number;

  courierStationDto: CourierStationDto = this.getDefaultStation();
  isLoading = false;
  private subs = new SubSink();

  constructor(
    public modal: NgbActiveModal,
    private courierStationService: CourierStationService
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.fetchCourierStation();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private fetchCourierStation(): void {
    this.isLoading = true;
    this.subs.sink = this.courierStationService.getById(this.id)
      .pipe(
        first(),
        catchError((error) => {
          console.error('Failed to fetch courier provider:', error);
          return of({ data: this.getDefaultStation() });
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((response: any) => {
        this.courierStationDto = response.data;
      });
  }

  private getDefaultStation(): CourierStationDto {
    return {
      id: 0,
      name: '',
      addressLine: '',
      city: '',
      area: '',
      supportPhone1: '',
      supportPhone2: '',
      email: '',
      latitude: undefined,
      longitude: undefined,
      googleMapUrl: '',
      isActive: true,
      courierProviderId: 0,
      courierProviderName: '',
      courierAreaMaps: []
    };
  }
}
