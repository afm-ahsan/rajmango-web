import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { DropdownModel } from 'src/app/shared/models/dropdown.model';
import { DropdownService } from 'src/app/shared/services/dropdown.service';
import { FilterUtils } from 'src/app/shared/utils/filter-utils';
import { SubSink } from 'subsink';
import { CourierRateConfigFacade } from '../courier-rate-config.facade';
import { CourierRateConfigPagedDto } from '../courier-rate-config.service';
import { CourierRateConfigDto } from '../models/courier-rate-config-dto';
import { CreateCourierRateConfigModalComponent } from '../create-courier-rate-config-modal/create-courier-rate-config-modal.component';
import { DeleteCourierRateConfigModalComponent } from '../delete-courier-rate-config-modal/delete-courier-rate-config-modal.component';

@Component({
  selector: 'app-courier-rate-config-list',
  templateUrl: './courier-rate-config-list.component.html',
  styleUrls: ['./courier-rate-config-list.component.scss']
})
export class CourierRateConfigListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  items: CourierRateConfigDto[] = [];
  totalCount = 0;
  searchVal = '';
  locationTypeFilter: number | null = null;
  locationTypeOptions: DropdownModel[] = [];

  filter: FilterModel = {
    offset: 0,
    limit: 0,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'sequence',
    sortOrder: 'asc',
    isDesc: false,
    userId: 0
  };

  constructor(
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private facade: CourierRateConfigFacade,
    private dropdownService: DropdownService
  ) {}

  ngOnInit(): void {
    this.locationTypeOptions = this.dropdownService.getLocationTypeOptions();
    this.load();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  load(onSuccess?: () => void): void {
    this.isLoading = true;
    const dto: CourierRateConfigPagedDto = {
      pageNumber: this.filter.pageNumber,
      pageSize: this.filter.pageSize,
      sortBy: this.filter.sortBy,
      sortOrder: this.filter.sortOrder,
      filter: this.searchVal,
      locationType: this.locationTypeFilter
    };
    this.subs.sink = this.facade.getPagedWithCount(dto)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
          MenuComponent.reinitialization();
        })
      )
      .subscribe({
        next: ([data, count]) => {
          this.items = data;
          this.totalCount = count;
          onSuccess?.();
        },
        error: () => {
          this.items = [];
          this.totalCount = 0;
        }
      });
  }

  create(): void {
    this.edit(0);
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(CreateCourierRateConfigModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result: string) => {
        if (result === 'success') {
          this.load(() => {
            Swal.fire({
              icon: 'success',
              title: 'Rate config saved!',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true
            });
          });
        }
      },
      () => {}
    );
  }

  delete(id: number): void {
    const modalRef = this.modalService.open(DeleteCourierRateConfigModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result: string) => { if (result === 'success') this.load(); },
      () => {}
    );
  }

  onSort(field: string): void {
    this.filter = FilterUtils.updateSort(this.filter, field);
    this.load();
  }

  onSearchChange(event: Event): void {
    this.searchVal = (event.target as HTMLInputElement).value;
    this.filter.pageNumber = 1;
    this.load();
  }

  onLocationTypeChange(): void {
    this.filter.pageNumber = 1;
    this.load();
  }

  pageChanged(page: number): void {
    this.filter.pageNumber = page;
    this.load();
  }

  pageSizeChanged(size: number): void {
    this.filter.pageNumber = 1;
    this.filter.pageSize = size;
    this.load();
  }

  getLocationTypeLabel(locationType: number): string {
    const opt = this.locationTypeOptions.find(o => o.id === locationType);
    return opt ? opt.label : '—';
  }

  getSortIcon(field: string): string {
    if (this.filter.sortBy !== field) return '';
    return this.filter.sortOrder === 'asc' ? '▲' : '▼';
  }
}
