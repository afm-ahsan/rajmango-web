import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MangoDetailModalComponent } from '../mango-detail-modal/mango-detail-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mango-card',
  templateUrl: './mango-card.component.html',
  styleUrls: ['./mango-card.component.scss']
})
export class MangoCardComponent {
  @Input() mango: any;

constructor(private modalService: NgbModal, private router: Router) {}
  
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

  orderNow(mango: any) {
    console.log('Ordering:', mango.name);
    // You can integrate your modal, cart service, or router navigation here
  }

  openOrderModal(): void {
    const modalRef = this.modalService.open(MangoDetailModalComponent, { size: 'md' });
    modalRef.componentInstance.mango = this.mango;
  }

  goToOrderList(): void {
    this.router.navigate(['/orders/order-list']);
  }

}
