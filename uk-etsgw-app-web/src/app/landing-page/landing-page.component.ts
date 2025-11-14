import { Component, inject } from '@angular/core';
import {
  PageHeadingComponent,
  RelatedContentComponent,
  ServiceBannerComponent,
} from '@etsgw/common/components';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { LinkDirective } from '@etsgw/govuk-components';
import { ClientType } from '../../environments/env-utils';
import { ConfigStore } from '@etsgw/core/config/config.store';
import { configQuery } from '@etsgw/core/config/config.selectors';
import { AuthService } from '@etsgw/core/services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'etsgw-landing',
  standalone: true,
  templateUrl: './landing-page.component.html',
  imports: [
    PageHeadingComponent,
    RelatedContentComponent,
    RouterLink,
    NgOptimizedImage,
    LinkDirective,
    ServiceBannerComponent,
  ],
})
export class LandingPageComponent {
  private configStore = inject(ConfigStore);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  protected pmrvEnabled = this.configStore.select(
    configQuery.selectIsFeatureEnabled('installationAviationEnabled')
  );
  protected wasteEnabled = this.configStore.select(
    configQuery.selectIsFeatureEnabled('wasteEnabled')
  );
  protected mrtmEnabled = this.configStore.select(
    configQuery.selectIsFeatureEnabled('maritimeEnabled')
  );
  protected pmrvRegistrationUrl = `${environment.appUrls.pmrv}registration`;
  protected pmrvContactUrl = `${environment.appUrls.pmrv}contact-us`;
  protected mrtmContactUrl = `${environment.appUrls.mrtm}contact-us`;

  async login(client: ClientType) {
    const appRedirectPath =
      this.route.snapshot.queryParamMap.get('appRedirectPath');
    if (
      !!appRedirectPath &&
      client in environment.appUrls &&
      appRedirectPath.startsWith(environment.appUrls[client])
    ) {
      await this.authService.login(client, appRedirectPath);
    } else {
      await this.authService.login(client);
    }
  }
}
