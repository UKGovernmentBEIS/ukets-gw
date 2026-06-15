import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ETSGW_KEYCLOAK } from '../../../auth.config';

export const bearerTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(ETSGW_KEYCLOAK);

  if (req.url.includes('api.pwnedpasswords.com') || !keycloak.authenticated) {
    return next(req);
  }

  return from(keycloak.updateToken(5)).pipe(
    switchMap(() => {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${keycloak.token}` },
      });
      return next(authReq);
    }),
  );
};
