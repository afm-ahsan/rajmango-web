import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService, UserType } from '../../../../../../features/auth';
import { TranslationService } from '../../../../../../features/i18n';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  readonly class =
    'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px';

  @HostBinding('attr.data-kt-menu')
  readonly dataKtMenu = 'true';

  user$: Observable<UserType> = this.auth.currentUser$;
  language!: LanguageFlag;
  langs: LanguageFlag[] = [...LANGUAGES];

  constructor(
    private auth: AuthService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    const selectedLang = this.translationService.getSelectedLanguage();
    this.setLanguage(selectedLang);
  }

  logout(): void {
    this.auth.logout();
    document.location.reload();
  }

  selectLanguage(lang: string): void {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
  }

  private setLanguage(lang: string): void {
    this.langs.forEach((language) => {
      language.active = language.lang === lang;
      if (language.active) {
        this.language = language;
      }
    });
  }

  createImgPath(serverPath: string | null | undefined): string {
    if (!serverPath) return 'assets/media/avatars/blank.png';
    const clean = serverPath.startsWith('/') ? serverPath.slice(1) : serverPath;
    return `${environment.apis.default.url}/${clean}`;
  }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = 'assets/media/avatars/blank.png';
  }

  ngOnDestroy(): void {
    // Nothing to cleanup now, placeholder if you later use SubSink or similar
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const LANGUAGES: LanguageFlag[] = [
  { lang: 'en', name: 'English', flag: './assets/media/flags/united-states.svg' },
  { lang: 'zh', name: 'Mandarin', flag: './assets/media/flags/china.svg' },
  { lang: 'es', name: 'Spanish', flag: './assets/media/flags/spain.svg' },
  { lang: 'ja', name: 'Japanese', flag: './assets/media/flags/japan.svg' },
  { lang: 'de', name: 'German', flag: './assets/media/flags/germany.svg' },
  { lang: 'fr', name: 'French', flag: './assets/media/flags/france.svg' },
];
