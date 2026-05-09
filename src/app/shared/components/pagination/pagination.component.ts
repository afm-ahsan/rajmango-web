import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  /** Available page size options */
  readonly pageSizeOptions = [5, 10, 25, 50, 75, 100];

  /** Total number of items in the dataset */
  @Input() collectionSize: number = 0;

  /** Current page size */
  @Input() pageSize: number = this.pageSizeOptions[2]; // Default: 25

  /** Current page number */
  @Input() pageNumber: number = 1;

  /** Emits when the page number changes */
  @Output() pageChange = new EventEmitter<number>();

  /** Emits when the page size changes */
  @Output() pageSizeChange = new EventEmitter<number>();

  /** Computed total page count */
  totalPageCount: number = 1;

  constructor() {}

  ngOnInit(): void {
    this.calculateTotalPages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.collectionSize || changes.pageSize) {
      this.calculateTotalPages();
    }
  }

  /** Called when user changes the page number */
  onPageChange(newPage: number): void {
    this.pageChange.emit(newPage);
  }

  /** Called when user selects a new page size */
  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.pageSizeChange.emit(newSize);
    this.calculateTotalPages();
  }

  /** Calculates the total number of pages */
  private calculateTotalPages(): void {
    this.totalPageCount = Math.max(Math.ceil(this.collectionSize / this.pageSize), 1);
  }
}
