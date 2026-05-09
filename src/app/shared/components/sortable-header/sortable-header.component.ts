import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-sortable-header',
  templateUrl: './sortable-header.component.html',
  styleUrls: ['./sortable-header.component.scss'] // optional
})
export class SortableHeaderComponent implements OnChanges {
  ngOnChanges(): void {
    if (this.direction !== 'asc' && this.direction !== 'desc') {
      this.direction = 'asc';
    }
  }
  @Input() field!: string;
  @Input() label!: string;
  @Input() active = false;
  @Input() direction: string = 'asc';

  @Output() sort = new EventEmitter<string>();
}

