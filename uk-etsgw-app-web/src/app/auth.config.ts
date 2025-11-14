import { InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

export const ETSGW_AUTH_SERVICE = new InjectionToken<KeycloakService>(
  'ETSGW AUTH SERVICE'
);
export const PMRV_AUTH_SERVICE = new InjectionToken<KeycloakService>(
  'PMRV AUTH SERVICE'
);
export const MRTM_AUTH_SERVICE = new InjectionToken<KeycloakService>(
  'MRTM AUTH SERVICE'
);

export function provideAuthClientConfig() {
  return makeEnvironmentProviders([
    { provide: ETSGW_AUTH_SERVICE, useClass: KeycloakService },
    { provide: PMRV_AUTH_SERVICE, useClass: KeycloakService },
    { provide: MRTM_AUTH_SERVICE, useClass: KeycloakService },
  ]);
}
