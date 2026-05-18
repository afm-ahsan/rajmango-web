import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-announcement-ticker',
  templateUrl: './announcement-ticker.component.html',
  styleUrls: ['./announcement-ticker.component.scss'],
})
export class AnnouncementTickerComponent {
  @Input() inline = false;
  isPaused = false;

  readonly items = [
    '🥭 Fresh seasonal mangoes now available',
    '🚚 Delivery across major areas in Bangladesh',
    '💳 bKash payment supported',
    '🌿 Naturally ripened premium mangoes',
  ];
}
