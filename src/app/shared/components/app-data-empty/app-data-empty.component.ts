import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-empty',
  templateUrl: './app-data-empty.component.html',
  styleUrls: ['./app-data-empty.component.scss']
})
export class AppDataEmptyComponent {
  @Input() icon: string = 'bi-inbox';
  @Input() title: string = 'No Data Available';
  @Input() message: string = 'No records found for your current selection.';
  @Input() buttonText?: string;
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}