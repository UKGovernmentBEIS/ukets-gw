import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

import { filter } from 'rxjs';

import { PhaseBarComponent } from '@etsgw/common/components';
import { AuthStore, selectIsLoggedIn } from '@etsgw/core/auth';
import { AuthService } from '@etsgw/core/services/auth.service';
import {
  BreadcrumbsComponent,
  GovukFooterComponent,
  GovukHeaderComponent,
  GovukLinkItem,
  GovukServiceNavigationComponent, GovukSkipLinkComponent,
  LinkDirective,
} from '@etsgw/govuk-components';

import { AppService } from './app.service';
import { TimeoutBannerComponent } from './timeout/timeout-banner/timeout-banner.component';

@Component({
  selector: 'etsgw-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    GovukHeaderComponent,
    GovukServiceNavigationComponent,
    GovukFooterComponent,
    GovukSkipLinkComponent,
    LinkDirective,
    BreadcrumbsComponent,
    TimeoutBannerComponent,
    PhaseBarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected authService = inject(AuthService);
  protected authStore = inject(AuthStore);
  protected appService = inject(AppService);
  private router = inject(Router);

  protected isLoggedIn = this.authStore.select(selectIsLoggedIn);

  protected readonly footerMetaLinks: GovukLinkItem[] = [
    { text: 'Privacy Notice', routerLink: '/privacy-notice' },
    { text: 'Contact us', routerLink: '/contact-us' },
    { text: 'Accessibility Statement', routerLink: '/accessibility' },
    { text: 'UK ETS legislation', routerLink: '/legislation' },
  ];

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e) => {
      const url = (e as NavigationEnd).urlAfterRedirects;
      this.appService.showHomeBreadcrumb.set(
        ['/accessibility', '/contact-us', '/legislation', '/privacy-notice'].includes(url),
      );
      this.appService.showPhaseLogin.set(url !== '/dashboard');
    });
  }
}
