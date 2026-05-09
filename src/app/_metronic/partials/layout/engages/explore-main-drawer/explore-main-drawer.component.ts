import { Component, OnInit } from '@angular/core';
import { environment_demo } from 'src/environments/environment.demo';

@Component({
  selector: 'app-explore-main-drawer',
  templateUrl: './explore-main-drawer.component.html',
})
export class ExploreMainDrawerComponent implements OnInit {
  appThemeName: string = environment_demo.appThemeName;
  appPurchaseUrl: string = environment_demo.appPurchaseUrl;
  appPreviewUrl: string = environment_demo.appPreviewUrl;
  appDemos = environment_demo.appDemos;

  constructor() {
  }

  ngOnInit(): void {
  }
}
