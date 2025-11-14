import { AsyncPipe, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ConfigStore } from '@etsgw/core/config/config.store';
import { configQuery } from '@etsgw/core/config/config.selectors';
import { UIConfigurationService } from '@etsgw/api';

@Component({
  selector: 'etsgw-service-banner',
  standalone: true,
  templateUrl: './service-banner.component.html',
  imports: [AsyncPipe, NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceBannerComponent implements OnInit {
  private configStore = inject(ConfigStore);
  private configurationService = inject(UIConfigurationService);
  notifications = this.configStore.select(configQuery.selectNotificationAlerts);

  ngOnInit(): void {
    this.configurationService.getUIFlags().subscribe((config) => {
      this.configStore.setNotificationAlerts(config.notificationAlerts);
    });
  }
}
