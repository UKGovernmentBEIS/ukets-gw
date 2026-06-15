import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { mockClass } from '@etsgw/common/testing';
import { AuthStore } from '@etsgw/core/auth';
import { AuthService } from '@etsgw/core/services/auth.service';
import { screen } from '@testing-library/angular';
import Keycloak from 'keycloak-js';

import { AppComponent } from './app.component';
import { ETSGW_KEYCLOAK } from './auth.config';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEvent, KeycloakEventType } from './core/auth/keycloak';

describe('AppComponent', () => {
  let store: AuthStore;
  let fixture: ComponentFixture<AppComponent>;
  const authService = mockClass(AuthService);
  const etsgwKeycloak: Partial<Keycloak> = {
    authenticated: false,
  };
  const keycloakEventSignal = signal<KeycloakEvent>({ type: KeycloakEventType.Ready });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ETSGW_KEYCLOAK, useValue: etsgwKeycloak },
        { provide: KEYCLOAK_EVENT_SIGNAL, useValue: keycloakEventSignal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);

    store = TestBed.inject(AuthStore);
    store.setIsLoggedIn(false);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should display sign out link when user is logged in', () => {
    store.setIsLoggedIn(true);
    fixture.detectChanges();
    const signOutLink = screen.getByRole('link', { name: /Sign out/i });
    expect(signOutLink).toBeVisible();
  });
});
