import { ConfigState, FeatureName } from './config.state';
import { createSelector, StateSelector } from '@etsgw/core/store/signal-store';
import { NotificationAlertDTO } from '@etsgw/api';

export const selectAuthServerUrl: StateSelector<ConfigState, string> =
  createSelector((state) => state.keycloakServerUrl);

export const selectIsFeatureEnabled = (
  feature: FeatureName
): StateSelector<ConfigState, boolean> =>
  createSelector((state) => state.features[feature]);

export const selectMeasurementId: StateSelector<ConfigState, string> =
  createSelector((state) => state.analytics.measurementId);
export const selectPropertyId: StateSelector<ConfigState, string> =
  createSelector((state) => state.analytics.propertyId);

const selectNotificationAlerts: StateSelector<
  ConfigState,
  NotificationAlertDTO[]
> = createSelector((state) => state.notificationAlerts);

export const configQuery = {
  selectAuthServerUrl,
  selectIsFeatureEnabled,
  selectMeasurementId,
  selectPropertyId,
  selectNotificationAlerts,
};
