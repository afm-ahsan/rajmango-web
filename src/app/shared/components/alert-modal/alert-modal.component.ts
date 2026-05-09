import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
})
export class AlertModalComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() btnOk: string;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
    if (this.title && !this.title.length) {
      this.title = 'Warning';
    }
    if (this.message && !this.message.length) {
      this.message = 'You are missing something. Please check once again.';
    }
    if (this.btnOk && !this.btnOk.length) {
      this.btnOk = 'Ok';
    }
  }

  Ok() {
    this.modal.dismiss();
  }
}
