import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, first, of } from 'rxjs';
import { SubSink } from 'subsink';
import { CourierAreaMapService } from '../courier-area-map.service';
import { CourierAreaMapDto } from '../models/courier-area-map-dto';

@Component({
  selector: 'app-view-courier-area-map-modal',
  templateUrl: './view-courier-area-map-modal.component.html',
  styleUrls: ['./view-courier-area-map-modal.component.scss']
})
export class ViewCourierAreaMapModalComponent implements OnInit, OnDestroy {
  @Input() id!: number;

  courierAreaMapDto: CourierAreaMapDto = this.getDefaultAreaMap();
  isLoading = false;
  private subs = new SubSink();

  constructor(
    public modal: NgbActiveModal,
    private courierAreaMapService: CourierAreaMapService
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.fetchCourierAreaMap();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private fetchCourierAreaMap(): void {
    this.isLoading = true;
    this.subs.sink = this.courierAreaMapService.getById(this.id)
      .pipe(
        first(),
        catchError((error) => {
          console.error('Failed to fetch courier area map:', error);
          return of({ data: this.getDefaultAreaMap() });
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((response: any) => {
        this.courierAreaMapDto = response.data;
      });
  }

  private getDefaultAreaMap(): CourierAreaMapDto {
    return {
      id: 0,
      area: '',
      courierStationId: 0,
      courierStationName: '',
    };
  }
}
