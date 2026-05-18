import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss'],
})
export class ErrorsComponent {
  @HostBinding('class') class = 'd-flex flex-column flex-root';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  goToHomepage(): void {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
