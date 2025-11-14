import { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';
import { KeycloakOptions } from 'keycloak-angular';
import { environment } from './environment';

export type ClientType = 'etsgw' | 'pmrv' | 'mrtm';

export function getKeycloakConfig(client: ClientType): KeycloakConfig {
  return {
    realm: 'uk-pmrv',
    clientId: environment.keycloakClientConfig[client],
  };
}

export function getKeycloakOptions(client: ClientType): KeycloakOptions {
  return {
    config: getKeycloakConfig(client),
    initOptions: getKeycloakInitOptions(client),
    enableBearerInterceptor: true,
    loadUserProfileAtStartUp: client === 'pmrv',
    bearerExcludedUrls: [],
    shouldAddToken: ({ url }) => !url.includes('api.pwnedpasswords.com'),
  };
}

export function getKeycloakInitOptions(
  client: ClientType
): KeycloakInitOptions {
  return {
    onLoad: client === 'etsgw' ? 'check-sso' : undefined,
    enableLogging: true,
    pkceMethod: 'S256',
  };
}
