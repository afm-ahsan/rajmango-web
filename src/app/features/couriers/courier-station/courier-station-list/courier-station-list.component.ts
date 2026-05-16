import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { ImagePathService } from 'src/app/shared/services/image-path.service';
import { FilterUtils } from 'src/app/shared/utils/filter-utils';
import { SubSink } from 'subsink';
import { CourierStationFacade } from '../courier-station.facade';
import { CreateCourierStationModalComponent } from '../create-courier-station-modal/create-courier-station-modal.component';
import { DeleteCourierStationModalComponent } from '../delete-courier-station-modal/delete-courier-station-modal.component';
import { CourierStationDto } from '../models/courier-station-dto';
import { ViewCourierStationModalComponent } from '../view-courier-station-modal/view-courier-station-modal.component';

@Component({
  selector: 'app-courier-station-list',
  templateUrl: './courier-station-list.component.html',
  styleUrls: ['./courier-station-list.component.scss']
})
export class CourierStationListComponent implements OnInit, OnDestroy {
  // 1. Class Properties
  subs = new SubSink();
  isLoading = false;
  courierStations: CourierStationDto[] = [];
  totalCount = 0;
  searchVal = '';
  
  filter: FilterModel = {
    offset: 0,
    limit: 0,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'name',
    sortOrder: 'asc',
    isDesc: false,
    userId: 0
  };

  // 2. Constructor (DI)
  constructor(
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private courierStationFacade: CourierStationFacade,
    private imagePathService: ImagePathService
  ) {}

  // 3. Lifecycle Hooks
  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // 4. Public Methods
  load(): void {
    this.isLoading = true;
    const dto = FilterUtils.createPagedRequest(this.filter, this.searchVal);
    this.subs.sink = this.courierStationFacade.getPagedWithCount(dto)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
          MenuComponent.reinitialization();
        })
      )
      .subscribe({
        next: ([data, count]) => {
          this.courierStations = data;
          this.totalCount = count;
        },
        error: () => {
          this.courierStations = [];
          this.totalCount = 0;
        }
      });
  }

  // ➕ Create
  create(): void {
    this.openModal(CreateCourierStationModalComponent, 0, 'lg');
  }

  // ✏️ Edit
  edit(id: number): void {
    this.openModal(CreateCourierStationModalComponent, id, 'lg');
  }

  // 👁️ View
  view(id: number): void {
    this.openModal(ViewCourierStationModalComponent, id, 'lg');
  }

  // ❌ Delete
  delete(id: number): void {
    this.openModal(DeleteCourierStationModalComponent, id, 'md');
  }

  // 🔄 Modal Launcher
  private openModal(component: any, id: number, size: string): void {
    const modalRef = this.modalService.open(component, { size: size });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result: 'success' | 'dismissed') => this.load(),
      (error: any) => console.warn('Modal dismissed:', error)
    );
  }

  // 5. Event Handlers
  onSort(field: string): void {
    this.filter = FilterUtils.updateSort(this.filter, field);
    this.load();
  }
  
  // 🔍 Handle search input
  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchVal = target.value;
    this.load();
  }

  // 📦 Handle page size change
  pageChanged(page: number): void {
    this.filter.pageNumber = page;
    this.load();
  }

  pageSizeChanged(size: number): void {
    this.filter.pageNumber = 1;
    this.filter.pageSize = size;
    this.load();
  }

  // 6. Utility Methods
  getImagePath(serverPath: string): string {
    return this.imagePathService.createFullPath(serverPath);
  }
}
