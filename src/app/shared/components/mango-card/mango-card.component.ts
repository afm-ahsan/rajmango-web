import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MangoDetailModalComponent } from '../mango-detail-modal/mango-detail-modal.component';
import { QuickOrderModalComponent } from '../quick-order-modal/quick-order-modal.component';

@Component({
  selector: 'app-mango-card',
  templateUrl: './mango-card.component.html',
  styleUrls: ['./mango-card.component.scss']
})
export class MangoCardComponent {
  @Input() mango: any;

  constructor(private modalService: NgbModal) {}

  getSweetnessWidth(level: string): string {
    switch ((level ?? '').toLowerCase()) {
      case 'very high': return '100%';
      case 'high': return '75%';
      case 'medium': return '50%';
      case 'low': return '25%';
      default: return '0%';
    }
  }

  openOrderModal(): void {
    const ref = this.modalService.open(MangoDetailModalComponent, { size: 'md' });
    ref.componentInstance.mango = this.mango;
    ref.result.then(
      (result) => {
        if (result?.action === 'order') {
          this.openQuickOrder();
        }
      },
      () => {}
    );
  }

  openQuickOrder(): void {
    if (!this.mango?.isAvailable) return;
    const ref = this.modalService.open(QuickOrderModalComponent, { size: 'md' });
    ref.componentInstance.mango = this.mango;
  }
}
