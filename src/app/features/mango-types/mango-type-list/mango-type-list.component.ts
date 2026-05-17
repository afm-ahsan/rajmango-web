import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { ImagePathService } from 'src/app/shared/services/image-path.service';
import { FilterUtils } from 'src/app/shared/utils/filter-utils';
import { SubSink } from 'subsink';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { CreateMangoTypeModalComponent } from '../create-mango-type-modal/create-mango-type-modal.component';
import { DeleteMangoTypeModalComponent } from '../delete-mango-type-modal/delete-mango-type-modal.component';
import { MangoTypeFacade } from '../mango-type.facade';
import { MangoTypeDto } from '../models/mango-type-dto.model';
import { ViewMangoTypeModalComponent } from '../view-mango-type-modal/view-mango-type-modal.component';

@Component({
  selector: 'app-mango-type-list',
  templateUrl: './mango-type-list.component.html',
  styleUrls: ['./mango-type-list.component.scss']
})
export class MangoTypeListComponent implements OnInit, OnDestroy {
  // 1. Class Properties
  subs = new SubSink();
  isLoading = false;
  mangoTypes: MangoTypeDto[] = [];
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
    private mangoTypeFacade: MangoTypeFacade,
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
    this.subs.sink = this.mangoTypeFacade.getPagedWithCount(dto)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
          MenuComponent.reinitialization();
        })
      )
      .subscribe({
        next: ([data, count]) => {
          this.mangoTypes = data;
          this.totalCount = count;
        },
      });
  }

  create(): void {
    this.edit(0);
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(CreateMangoTypeModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result: 'success' | 'dismissed') => {
        //if (result === 'success') 
        this.load();
      },
      () => {}
    );
  }

  delete(id: number): void {
    const modalRef = this.modalService.open(DeleteMangoTypeModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result: 'success' | 'dismissed') => {
        //if (result === 'success') 
        this.load();
      },
      () => {}
    );
  }

  view(id: number): void {
    const modalRef = this.modalService.open(ViewMangoTypeModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result: 'success' | 'dismissed') => {
        if (result === 'success') 
          this.load();
      },
      () => {}
    );
  }

  // 5. Event Handlers
  onSort(field: string): void {
    this.filter = FilterUtils.updateSort(this.filter, field);
    this.load();
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchVal = target.value;
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

  // 6. Utility Methods
  getImagePath(serverPath: string): string {
    return this.imagePathService.createFullPath(serverPath);
  }

  getSweetnessLabel(level: number): string {
    return EnumLabelUtils.getSweetnessLevelLabel(level);
  }

  getSweetnessBadgeClass(level: number): string {
    return EnumLabelUtils.getSweetnessLevelBadgeClass(level);
  }

  getGradeLabel(grade: number): string {
    return EnumLabelUtils.getMangoGradeLabel(grade);
  }

  getGradeBadgeClass(grade: number): string {
    return EnumLabelUtils.getMangoGradeBadgeClass(grade);
  }
}
