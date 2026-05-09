import { Component, OnInit } from '@angular/core';
import { environment_demo } from 'src/environments/environment.demo';

@Component({
  selector: 'app-help-drawer',
  templateUrl: './help-drawer.component.html',
})
export class HelpDrawerComponent implements OnInit {
  appThemeName: string = environment_demo.appThemeName;
  appPurchaseUrl: string = environment_demo.appPurchaseUrl;

  constructor() {
  }

  ngOnInit(): void {
  }
}
