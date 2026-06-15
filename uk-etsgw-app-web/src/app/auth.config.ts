import { InjectionToken, makeEnvironmentProviders } from '@angular/core';

import Keycloak from 'keycloak-js';

import { getKeycloakConfig } from '../environments/env-utils';
import { createKeycloakSignal, KEYCLOAK_EVENT_SIGNAL } from './core/auth/keycloak';

export const ETSGW_KEYCLOAK = new InjectionToken<Keycloak>('ETSGW KEYCLOAK');
export const PMRV_KEYCLOAK = new InjectionToken<Keycloak>('PMRV KEYCLOAK');
export const MRTM_KEYCLOAK = new InjectionToken<Keycloak>('MRTM KEYCLOAK');

export const keycloakConfigs = {
  etsgw: getKeycloakConfig('etsgw'),
  pmrv: getKeycloakConfig('pmrv'),
  mrtm: getKeycloakConfig('mrtm'),
};

const etsgwKeycloak = new Keycloak(keycloakConfigs.etsgw);
const pmrvKeycloak = new Keycloak(keycloakConfigs.pmrv);
const mrtmKeycloak = new Keycloak(keycloakConfigs.mrtm);

const etsgwEventSignal = createKeycloakSignal(etsgwKeycloak);

export function provideAuthClientConfig() {
  return makeEnvironmentProviders([
    { provide: ETSGW_KEYCLOAK, useValue: etsgwKeycloak },
    { provide: PMRV_KEYCLOAK, useValue: pmrvKeycloak },
    { provide: MRTM_KEYCLOAK, useValue: mrtmKeycloak },
    { provide: KEYCLOAK_EVENT_SIGNAL, useValue: etsgwEventSignal },
  ]);
}
