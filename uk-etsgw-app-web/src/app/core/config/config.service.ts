import { Injectable, Signal } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import {
  selectIsFeatureEnabled,
  selectMeasurementId,
  selectPropertyId,
} from './config.selectors';
import { ConfigState, FeatureName } from './config.state';
import { ConfigStore } from './config.store';
import { UIConfigurationService } from '@etsgw/api';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  constructor(
    private readonly store: ConfigStore,
    private readonly configurationService: UIConfigurationService
  ) {}

  initConfigState(): Observable<ConfigState> {
    return this.configurationService.getUIFlags().pipe(
      tap((props) => this.store.setState({ ...props } as ConfigState)),
      map(() => this.store.state)
    );
  }

  isFeatureEnabled(feature: FeatureName): Signal<boolean> {
    return this.store.select(selectIsFeatureEnabled(feature));
  }

  getMeasurementId(): Signal<string> {
    return this.store.select(selectMeasurementId);
  }
  getPropertyId(): Signal<string> {
    return this.store.select(selectPropertyId);
  }
}
