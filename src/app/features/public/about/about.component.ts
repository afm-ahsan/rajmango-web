import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  scrollProgress = 0;
  readonly currentYear = new Date().getFullYear();

  @HostListener('window:scroll')
  onScroll(): void {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = total > 0 ? (window.scrollY / total) * 100 : 0;
  }
}
