import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { ImagePathService } from 'src/app/shared/services/image-path.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { FilterUtils } from 'src/app/shared/utils/filter-utils';
import { SubSink } from 'subsink';
import { CourierProviderFacade } from '../courier-provider.facade';
import { CreateCourierProviderModalComponent } from '../create-courier-provider-modal/create-courier-provider-modal.component';
import { DeleteCourierProviderModalComponent } from '../delete-courier-provider-modal/delete-courier-provider-modal.component';
import { CourierProviderDto } from '../models/courier-provider-dto';
import { ViewCourierProviderModalComponent } from '../view-courier-provider-modal/view-courier-provider-modal.component';

@Component({
  selector: 'app-courier-provider-list',
  templateUrl: './courier-provider-list.component.html',
  styleUrls: ['./courier-provider-list.component.scss']
})
export class CourierProviderListComponent implements OnInit, OnDestroy {
  // 1. Class Properties
  subs = new SubSink();
  isLoading = false;
  courierProviders: CourierProviderDto[] = [];
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
    private loaderService: LoaderService,
    private courierProviderFacade: CourierProviderFacade,
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
    this.loaderService.show();
    const dto = FilterUtils.createPagedRequest(this.filter, this.searchVal);
    this.subs.sink = this.courierProviderFacade.getPagedWithCount(dto)
      .subscribe(([data, count]) => {
        this.courierProviders = data;
        this.totalCount = count;
        this.isLoading = false;
        this.loaderService.hide();
        this.cdRef.detectChanges();
        MenuComponent.reinitialization(); // Required to rebind dropdown menu actions
      });
  }

  create(): void {
    this.edit(0);
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(CreateCourierProviderModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result: 'success' | 'dismissed') => {
        //if (result === 'success') 
          this.load();
      },
      (error: any) => console.warn('Modal dismissed:', error)
    );
  }

  delete(id: number): void {
    const modalRef = this.modalService.open(DeleteCourierProviderModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result: 'success' | 'dismissed') => {
        //if (result === 'success') 
          this.load();
      },
      (error: any) => console.warn('Modal dismissed:', error)
    );
  }

  view(id: number): void {
    const modalRef = this.modalService.open(ViewCourierProviderModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result: 'success' | 'dismissed') => {
        //if (result === 'success') 
          this.load();
      },
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
