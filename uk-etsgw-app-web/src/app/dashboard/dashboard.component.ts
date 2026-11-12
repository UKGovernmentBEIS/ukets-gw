import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent } from '@etsgw/common/components';
import { AuthStore, selectUserProfile } from '@etsgw/core/auth';
import { configQuery } from '@etsgw/core/config/config.selectors';
import { ConfigStore } from '@etsgw/core/config/config.store';
import { LinkDirective } from '@etsgw/govuk-components';

import { environment } from '../../environments/environment';

@Component({
  selector: 'etsgw-dashboard',
  standalone: true,
  imports: [PageHeadingComponent, LinkDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly configStore = inject(ConfigStore);
  private readonly authStore = inject(AuthStore);

  protected appUrls = environment.appUrls;
  protected pmrvInstallationUrl = `${environment.appUrls.pmrv}landing?domain=INSTALLATION`;
  protected pmrvAviationUrl = `${environment.appUrls.pmrv}landing?domain=AVIATION`;
  protected pmrvEnabled = this.configStore.select(configQuery.selectIsFeatureEnabled('installationAviationEnabled'));
  protected mrtmEnabled = this.configStore.select(configQuery.selectIsFeatureEnabled('maritimeEnabled'));
  protected userProfile = this.authStore.select(selectUserProfile);
}
