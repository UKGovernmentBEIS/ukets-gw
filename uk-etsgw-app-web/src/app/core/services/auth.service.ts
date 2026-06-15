import { inject, Injectable } from '@angular/core';

import { from, map, Observable, of, switchMap, tap } from 'rxjs';

import Keycloak from 'keycloak-js';

import { ClientType } from '../../../environments/env-utils';
import { environment } from '../../../environments/environment';
import { ETSGW_KEYCLOAK, MRTM_KEYCLOAK, PMRV_KEYCLOAK } from '../../auth.config';
import { AuthStore } from '../auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly etsgwKeycloak = inject(ETSGW_KEYCLOAK);
  private readonly pmrvKeycloak = inject(PMRV_KEYCLOAK);
  private readonly mrtmKeycloak = inject(MRTM_KEYCLOAK);
  private readonly authStore = inject(AuthStore);

  login(client: ClientType, redirectUri = environment.appUrls[client]): Promise<void> {
    const keycloak: Keycloak = {
      etsgw: this.etsgwKeycloak,
      pmrv: this.pmrvKeycloak,
      mrtm: this.mrtmKeycloak,
    }[client];

    return keycloak.login({ redirectUri });
  }

  logout(redirectPath = '') {
    this.authStore.setIsLoggedIn(false);
    return this.etsgwKeycloak.logout({ redirectUri: location.origin + redirectPath });
  }

  checkUser(): Observable<void> {
    return this.authStore.state.isLoggedIn === null
      ? this.loadIsLoggedIn().pipe(
          switchMap((res: boolean) =>
            res ? this.loadUserProfile().pipe(map(() => undefined)) : of(undefined),
          ),
        )
      : of(undefined);
  }

  loadUserProfile(): Observable<object> {
    return from(this.etsgwKeycloak.loadUserProfile()).pipe(
      tap((profile) => this.authStore.setUserProfile(profile)),
    );
  }

  loadIsLoggedIn(): Observable<boolean> {
    return of(!!this.etsgwKeycloak.authenticated).pipe(
      tap((isLoggedIn) => this.authStore.setIsLoggedIn(isLoggedIn)),
    );
  }
}
