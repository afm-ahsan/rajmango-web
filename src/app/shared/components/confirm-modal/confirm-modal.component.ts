import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {    
    if (this.title && !this.title.length) {
      this.title = 'Confirm';
    }

    if (this.message && !this.message.length) {
      this.message = 'Are you sure to confirm this?';
    }
  }

  confirm() {
    this.modal.close(true);
  }
}