import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mango-detail-modal',
  templateUrl: './mango-detail-modal.component.html',
  styleUrls: ['./mango-detail-modal.component.scss']
})
export class MangoDetailModalComponent {
  @Input() mango: any;

constructor(public activeModal: NgbActiveModal, private router: Router) {}

  getSweetnessWidth(level: string): string {
    switch (level.toLowerCase()) {
      case 'very high': return '100%';
      case 'high': return '80%';
      case 'medium-high': return '60%';
      case 'medium': return '40%';
      case 'low': return '20%';
      default: return '10%';
    }
  }

  goToOrderList(): void {
    this.activeModal.close();
    this.router.navigate(['/orders/order-list']);
  }
}