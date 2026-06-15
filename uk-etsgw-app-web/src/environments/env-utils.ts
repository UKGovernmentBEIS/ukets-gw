import { KeycloakInitOptions, KeycloakServerConfig } from 'keycloak-js';

import { environment } from './environment';

export type ClientType = 'etsgw' | 'pmrv' | 'mrtm';

export function getKeycloakConfig(client: ClientType): KeycloakServerConfig {
  return {
    url: '',
    realm: 'uk-pmrv',
    clientId: environment.keycloakClientConfig[client],
  };
}

export function getKeycloakInitOptions(client: ClientType): KeycloakInitOptions {
  return {
    onLoad: client === 'etsgw' ? 'check-sso' : undefined,
    enableLogging: true,
    pkceMethod: 'S256',
  };
}
