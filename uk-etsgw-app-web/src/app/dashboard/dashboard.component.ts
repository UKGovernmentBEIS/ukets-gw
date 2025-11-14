import { Component, inject } from '@angular/core';
import { PageHeadingComponent } from '@etsgw/common/components';
import { LinkDirective } from '@etsgw/govuk-components';
import { environment } from '../../environments/environment';
import { configQuery } from '@etsgw/core/config/config.selectors';
import { ConfigStore } from '@etsgw/core/config/config.store';

@Component({
  selector: 'etsgw-dashboard',
  standalone: true,
  imports: [PageHeadingComponent, LinkDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private configStore = inject(ConfigStore);
  protected appUrls = environment.appUrls;
  protected pmrvEnabled = this.configStore.select(
    configQuery.selectIsFeatureEnabled('installationAviationEnabled')
  );
  protected mrtmEnabled = this.configStore.select(
    configQuery.selectIsFeatureEnabled('maritimeEnabled')
  );
}
