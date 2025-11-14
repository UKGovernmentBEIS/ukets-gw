import { CanActivateFn, Router, Routes } from '@angular/router';
import { VersionComponent } from './version/version.component';
import { TimedOutComponent } from './timeout/timed-out/timed-out.component';
import { inject } from '@angular/core';
import { AuthService } from '@etsgw/core/services/auth.service';
import { AuthStore, selectIsLoggedIn } from '@etsgw/core/auth';
import { first, map } from 'rxjs';
import { LandingPageComponent } from './landing-page';
import { DashboardComponent } from './dashboard';
import { ETSGW_AUTH_SERVICE } from './auth.config';
import { PageNotFoundComponent } from '@etsgw/common/components';
import { PrivacyNoticeComponent } from './privacy-notice';
import { ContactUsComponent } from './contact-us';
import { AccessibilityComponent } from './accessibility';
import { LegislationComponent } from './legislation';

const authGuard: CanActivateFn = () => {
  const authClient = inject(ETSGW_AUTH_SERVICE);
  const router = inject(Router);
  return authClient.isLoggedIn() || router.parseUrl('landing');
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
