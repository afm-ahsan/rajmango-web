import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent {
  scrollProgress = 0;
  activeSection = '';
  readonly currentYear = new Date().getFullYear();

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
    const ids = ['introduction', 'data-collected', 'how-we-use', 'storage-security',
                 'your-rights', 'cookies', 'third-parties', 'changes', 'contact'];
    let current = '';
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && window.pageYOffset >= el.offsetTop - 250) current = id;
    }
    if (current) this.activeSection = current;
  }
}
