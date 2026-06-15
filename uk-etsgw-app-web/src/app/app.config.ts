import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { ConfigService } from '@etsgw/core/config/config.service';
import { AuthService } from '@etsgw/core/services/auth.service';
import Keycloak from 'keycloak-js';

import { getKeycloakInitOptions } from '../environments/env-utils';
import { routes } from './app.routes';
import {
  ETSGW_KEYCLOAK,
  keycloakConfigs,
  MRTM_KEYCLOAK,
  PMRV_KEYCLOAK,
  provideAuthClientConfig,
} from './auth.config';
import { bearerTokenInterceptor } from './core/auth/keycloak';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([bearerTokenInterceptor])),
    provideAuthClientConfig(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initApp,
      deps: [ConfigService, AuthService, ETSGW_KEYCLOAK, PMRV_KEYCLOAK, MRTM_KEYCLOAK],
    },
  ],
};

export function initApp(
  configService: ConfigService,
  authService: AuthService,
  etsgwKeycloak: Keycloak,
  pmrvKeycloak: Keycloak,
  mrtmKeycloak: Keycloak,
) {
  return async () => {
    const { keycloakServerUrl } = await firstValueFrom(configService.initConfigState());

    keycloakConfigs.etsgw.url = keycloakServerUrl;
    keycloakConfigs.pmrv.url = keycloakServerUrl;
    keycloakConfigs.mrtm.url = keycloakServerUrl;

    await Promise.all([
      etsgwKeycloak.init(getKeycloakInitOptions('etsgw')),
      pmrvKeycloak.init(getKeycloakInitOptions('pmrv')),
      mrtmKeycloak.init(getKeycloakInitOptions('mrtm')),
    ]);

    return await firstValueFrom(authService.checkUser());
  };
}
