import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent {
  scrollProgress = 0;
  readonly currentYear = new Date().getFullYear();

  @HostListener('window:scroll')
  onScroll(): void {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = total > 0 ? (window.scrollY / total) * 100 : 0;
  }
}
