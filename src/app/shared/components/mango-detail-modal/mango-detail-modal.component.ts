import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mango-detail-modal',
  templateUrl: './mango-detail-modal.component.html',
  styleUrls: ['./mango-detail-modal.component.scss']
})
export class MangoDetailModalComponent {
  @Input() mango: any;

  constructor(public activeModal: NgbActiveModal) {}

  getSweetnessWidth(level: string): string {
    switch ((level ?? '').toLowerCase()) {
      case 'very high': return '100%';
      case 'high': return '75%';
      case 'medium': return '50%';
      case 'low': return '25%';
      default: return '0%';
    }
  }

  proceedToOrder(): void {
    this.activeModal.close({ action: 'order' });
  }
}
