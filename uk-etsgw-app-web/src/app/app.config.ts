import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ConfigService } from '@etsgw/core/config/config.service';
import { firstValueFrom } from 'rxjs';
import {
  ETSGW_AUTH_SERVICE,
  MRTM_AUTH_SERVICE,
  PMRV_AUTH_SERVICE,
  provideAuthClientConfig,
} from './auth.config';
import { AuthService } from '@etsgw/core/services/auth.service';
import { KeycloakOptions, KeycloakService } from 'keycloak-angular';
import { KeycloakConfig } from 'keycloak-js';
import { produce } from 'immer';
import { getKeycloakOptions } from '../environments/env-utils';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAuthClientConfig(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initApp,
      deps: [
        ConfigService,
        AuthService,
        ETSGW_AUTH_SERVICE,
        PMRV_AUTH_SERVICE,
        MRTM_AUTH_SERVICE,
      ],
    },
  ],
};

function insertServerUrlToKeycloakOptions(
  options: KeycloakOptions,
  serverUrl: string
): KeycloakOptions {
  return produce(options, (o) => {
    (o.config as KeycloakConfig).url = serverUrl;
  });
}

export function initApp(
  configService: ConfigService,
  authService: AuthService,
  etsgwAuthService: KeycloakService,
  pmrvAuthService: KeycloakService,
  mrtmAuthService: KeycloakService
) {
  return async () => {
    const { keycloakServerUrl } = await firstValueFrom(
      configService.initConfigState()
    );
    await Promise.all([
      etsgwAuthService.init(
        insertServerUrlToKeycloakOptions(
          getKeycloakOptions('etsgw'),
          keycloakServerUrl
        )
      ),
      pmrvAuthService.init(
        insertServerUrlToKeycloakOptions(
          getKeycloakOptions('pmrv'),
          keycloakServerUrl
        )
      ),
      mrtmAuthService.init(
        insertServerUrlToKeycloakOptions(
          getKeycloakOptions('mrtm'),
          keycloakServerUrl
        )
      ),
    ]);

    return await firstValueFrom(authService.checkUser());
  };
}
