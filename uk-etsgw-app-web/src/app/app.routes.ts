import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';

import { first, map } from 'rxjs';

import { PageNotFoundComponent } from '@etsgw/common/components';
import { AuthStore, selectIsLoggedIn } from '@etsgw/core/auth';
import { AuthService } from '@etsgw/core/services/auth.service';

import { AccessibilityComponent } from './accessibility';
import { ETSGW_KEYCLOAK } from './auth.config';
import { ContactUsComponent } from './contact-us';
import { DashboardComponent } from './dashboard';
import { LandingPageComponent } from './landing-page';
import { LegislationComponent } from './legislation';
import { PrivacyNoticeComponent } from './privacy-notice';
import { TimedOutComponent } from './timeout/timed-out/timed-out.component';
import { VersionComponent } from './version/version.component';

const authGuard: CanActivateFn = () => {
  const keycloak = inject(ETSGW_KEYCLOAK);
  const router = inject(Router);
  return !!keycloak.authenticated || router.parseUrl('landing');
};

const nonAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return authService.checkUser().pipe(
    map(() => !authStore.select(selectIsLoggedIn)() || router.parseUrl('dashboard')),
    first(),
  );
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'landing',
  },
  {
    path: 'landing',
    title: 'ETS Gateway',
    canActivate: [nonAuthGuard],
    component: LandingPageComponent,
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    canActivate: [authGuard],
    component: DashboardComponent,
  },
  {
    path: 'privacy-notice',
    title: 'Privacy notice',
    component: PrivacyNoticeComponent,
  },
  {
    path: 'contact-us',
    title: 'Contact Us',
    component: ContactUsComponent,
  },
  {
    path: 'accessibility',
    title: 'Accessibility statement',
    component: AccessibilityComponent,
  },
  {
    path: 'legislation',
    title: 'Legislation',
    component: LegislationComponent,
  },
  {
    path: 'about',
    title: 'About',
    component: VersionComponent,
  },
  {
    path: 'timed-out',
    title: 'Session Timeout',
    canActivate: [nonAuthGuard],
    component: TimedOutComponent,
  },
  {
    path: 'not-found',
    title: 'Page not found',
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'landing',
  },
];
