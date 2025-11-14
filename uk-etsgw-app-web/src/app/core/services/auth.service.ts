import { Inject, Injectable } from '@angular/core';

import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthStore } from '../auth';
import { ClientType } from '../../../environments/env-utils';
import { KeycloakService } from 'keycloak-angular';
import {
  ETSGW_AUTH_SERVICE,
  MRTM_AUTH_SERVICE,
  PMRV_AUTH_SERVICE,
} from '../../auth.config';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    @Inject(ETSGW_AUTH_SERVICE)
    private readonly etsgwKeycloakService: KeycloakService,
    @Inject(PMRV_AUTH_SERVICE)
    private readonly pmrvKeycloakService: KeycloakService,
    @Inject(MRTM_AUTH_SERVICE)
    private readonly mrtmKeycloakService: KeycloakService,
    private readonly authStore: AuthStore
  ) {}

  login(
    client: ClientType,
    redirectUri = environment.appUrls[client]
  ): Promise<void> {
    const service = {
      etsgw: this.etsgwKeycloakService,
      pmrv: this.pmrvKeycloakService,
      mrtm: this.mrtmKeycloakService,
    }[client];

    return service.login({ redirectUri });
  }

  logout(redirectPath = '') {
    this.authStore.setIsLoggedIn(false);
    return this.etsgwKeycloakService.logout(location.origin + redirectPath);
  }

  checkUser(): Observable<void> {
    return this.authStore.state.isLoggedIn === null
      ? this.loadIsLoggedIn().pipe(
          switchMap((res: boolean) =>
            res
              ? this.loadUserProfile().pipe(map(() => undefined))
              : of(undefined)
          )
        )
      : of(undefined);
  }

  loadUserProfile(): Observable<object> {
    return from(this.etsgwKeycloakService.loadUserProfile()).pipe(
      tap((profile) => this.authStore.setUserProfile(profile))
    );
  }

  loadIsLoggedIn(): Observable<boolean> {
    return of(this.etsgwKeycloakService.isLoggedIn()).pipe(
      tap((isLoggedIn) => this.authStore.setIsLoggedIn(isLoggedIn))
    );
  }
}
