import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  BreadcrumbsComponent,
  FooterComponent,
  HeaderActionsListComponent,
  HeaderComponent,
  LinkDirective,
  MetaInfoComponent,
  SkipLinkComponent,
} from '@etsgw/govuk-components';
import { TimeoutBannerComponent } from './timeout/timeout-banner/timeout-banner.component';
import { AuthStore, selectIsLoggedIn } from '@etsgw/core/auth';
import { AuthService } from '@etsgw/core/services/auth.service';
import { PhaseBarComponent } from '@etsgw/common/components';
import { SkipLinkFocusDirective } from '@etsgw/common/directives';
import { AppService } from './app.service';
import { filter } from 'rxjs';

@Component({
  selector: 'etsgw-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    HeaderActionsListComponent,
    SkipLinkComponent,
    FooterComponent,
    LinkDirective,
    RouterLink,
    TimeoutBannerComponent,
    MetaInfoComponent,
    SkipLinkFocusDirective,
    PhaseBarComponent,
    BreadcrumbsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected authService = inject(AuthService);
  protected isLoggedIn = inject(AuthStore).select(selectIsLoggedIn);
  protected appService = inject(AppService);
  private router = inject(Router);

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e) => {
      this.appService.showHomeBreadcrumb.set(
        ['/accessibility', '/contact-us', '/legislation', '/privacy-notice'].includes(
          (e as NavigationEnd).urlAfterRedirects,
        ),
      );
    });
  }
}
