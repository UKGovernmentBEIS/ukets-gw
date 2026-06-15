import { effect, inject, Injectable } from '@angular/core';

import { BehaviorSubject, EMPTY, switchMap, tap, timer } from 'rxjs';

import { AuthService } from '@etsgw/core/services/auth.service';
import Keycloak from 'keycloak-js';

import { environment } from '../../../environments/environment';
import { ETSGW_KEYCLOAK } from '../../auth.config';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from '@etsgw/core/auth/keycloak';

@Injectable({ providedIn: 'root' })
export class TimeoutBannerService {
  private readonly etsgwKeycloak = inject<Keycloak>(ETSGW_KEYCLOAK);
  private readonly authService = inject(AuthService);
  private readonly keycloakEventSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  private get refreshTokenParsed() {
    return this.etsgwKeycloak.refreshTokenParsed;
  }

  private get refreshTokenParsedExp() {
    return this.refreshTokenParsed?.exp;
  }

  private get refreshTokenParsedIat() {
    return this.refreshTokenParsed?.iat;
  }

  private get refreshTokenExpOffset() {
    return this.refreshTokenParsedExp - this.refreshTokenParsedIat;
  }

  timeOffsetSeconds = environment.timeoutBanner.timeOffsetSeconds;

  timeExtensionAllowed$ = new BehaviorSubject<boolean>(true);
  isVisible$ = new BehaviorSubject<boolean>(false);

  countDownTime$ = new BehaviorSubject<number>(this.calculateCountdownTime());
  private initialRefreshTokenExpOffset = this.refreshTokenExpOffset;

  constructor() {
    effect(() => {
      const event = this.keycloakEventSignal();

      switch (event?.type) {
        case KeycloakEventType.AuthRefreshSuccess:
          this.countDownTime$.next(this.calculateCountdownTime());
          console.log('Countdown restarted');

          if (this.refreshTokenExpOffset < this.initialRefreshTokenExpOffset) {
            this.timeExtensionAllowed$.next(false);
          }
          break;
        case KeycloakEventType.AuthLogout:
          this.idleLogout();
          break;
      }
    });

    this.countDownTime$
      .pipe(
        tap((cd) => console.log('Countdown:', cd)),
        switchMap((countDownTime) => {
          return countDownTime > 0 ? timer(countDownTime).pipe(tap(() => this.isVisible$.next(true))) : EMPTY;
        }),
      )
      .subscribe();

    this.isVisible$
      .pipe(
        switchMap((isVisible) =>
          isVisible
            ? timer(this.timeOffsetSeconds * 1000).pipe(
                tap(() => {
                  this.isVisible$.next(false);
                  this.idleLogout();
                }),
              )
            : EMPTY,
        ),
      )
      .subscribe();
  }

  extendSession() {
    return this.etsgwKeycloak.updateToken(-1).then(() => this.isVisible$.next(false));
  }

  signOut() {
    this.isVisible$.next(false);
    this.authService.logout();
  }

  private idleLogout() {
    const idleTime = this.refreshTokenParsedExp - this.refreshTokenParsedIat;
    this.authService.logout('/timed-out?idle=' + idleTime);
  }

  private calculateCountdownTime(): number {
    return this.refreshTokenParsedExp * 1000 - Date.now() - this.timeOffsetSeconds * 1000;
  }
}
