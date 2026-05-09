import { Component, OnInit } from '@angular/core';
import { environment_demo } from '../../../../../../environments/environment.demo';

@Component({
  selector: 'app-purchase-toolbar',
  templateUrl: './purchase-toolbar.component.html',
})
export class PurchaseToolbarComponent implements OnInit {
  appPurchaseUrl: string = environment_demo.appPurchaseUrl;

  constructor() {
  }

  ngOnInit(): void {
  }
}
