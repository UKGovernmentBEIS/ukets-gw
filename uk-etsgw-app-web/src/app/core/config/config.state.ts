import { NotificationAlertDTO } from '@etsgw/api';

export const FEATURES = [
  'terms',
  'installationAviationEnabled',
  'maritimeEnabled',
] as const;
export type FeatureName = (typeof FEATURES)[number];
export type FeaturesConfig = { [key in FeatureName]?: boolean };

export interface ConfigState {
  features?: FeaturesConfig;
  analytics?: {
    measurementId: string;
    propertyId: string;
  };
  keycloakServerUrl?: string;
  notificationAlerts?: NotificationAlertDTO[];
}

export const initialState: ConfigState = {
  features: {},
  analytics: {
    measurementId: '',
    propertyId: '',
  },
  notificationAlerts: null,
};
