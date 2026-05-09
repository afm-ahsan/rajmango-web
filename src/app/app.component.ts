import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { TranslationService } from './features/i18n';
import { locale as enLang } from './features/i18n/vocabs/en';
import { LoaderService } from './shared/services/loader.service';

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(private router: Router, 
              private loader: LoaderService, 
              private translationService: TranslationService) {
    this.router.events.subscribe(event => {
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loader.hide();
      }
    });
    
    // register translations
    this.translationService.loadTranslations(enLang);
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}
}
