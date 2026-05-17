import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
})
export class TermsAndConditionsComponent {
  scrollProgress = 0;
  activeSection = '';

  @HostListener('window:scroll')
  onScroll(): void {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = total > 0 ? (window.scrollY / total) * 100 : 0;
    this._updateActiveSection();
  }

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private _updateActiveSection(): void {
    const ids = ['introduction', 'definitions', 'account', 'availability',
                 'orders', 'pricing', 'payment', 'delivery',
                 'cancellation', 'refunds', 'liability', 'contact'];
    let current = '';
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && window.pageYOffset >= el.offsetTop - 250) current = id;
    }
    if (current) this.activeSection = current;
  }
}
