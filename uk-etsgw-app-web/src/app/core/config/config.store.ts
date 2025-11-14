import { Injectable } from '@angular/core';

import { ConfigState, initialState } from './config.state';
import { SignalStore } from '@etsgw/core/store/signal-store';
import { NotificationAlertDTO } from '@etsgw/api';

@Injectable({ providedIn: 'root' })
export class ConfigStore extends SignalStore<ConfigState> {
  constructor() {
    super(initialState);
  }

  setNotificationAlerts(notificationAlerts: NotificationAlertDTO[]) {
    this.setState({
      ...this.state,
      notificationAlerts,
    });
  }
}
