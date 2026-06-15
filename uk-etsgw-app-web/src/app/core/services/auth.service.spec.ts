import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { firstValueFrom } from 'rxjs';

import { AuthStore, selectIsLoggedIn, selectUser, selectUserProfile } from '@etsgw/core/auth';
import { ConfigStore } from '@etsgw/core/config/config.store';
import Keycloak from 'keycloak-js';

import { ETSGW_KEYCLOAK, MRTM_KEYCLOAK, PMRV_KEYCLOAK } from '../../auth.config';
import { KEYCLOAK_EVENT_SIGNAL } from '../auth/keycloak';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let authStore: AuthStore;
  let configStore: ConfigStore;

  const etsgwKeycloak: Partial<Keycloak> = {
    login: jest.fn(),
    logout: jest.fn().mockResolvedValue(undefined),
    loadUserProfile: jest.fn(),
    authenticated: false,
  };
  const pmrvKeycloak: Partial<Keycloak> = {
    login: jest.fn(),
  };
  const mrtmKeycloak: Partial<Keycloak> = {
    login: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: ETSGW_KEYCLOAK, useValue: etsgwKeycloak },
        { provide: PMRV_KEYCLOAK, useValue: pmrvKeycloak },
        { provide: MRTM_KEYCLOAK, useValue: mrtmKeycloak },
        { provide: KEYCLOAK_EVENT_SIGNAL, useValue: signal({ type: 'Ready' }) },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    configStore = TestBed.inject(ConfigStore);
    configStore.setState({ features: { terms: true } });

    service = TestBed.inject(AuthService);
    (etsgwKeycloak.loadUserProfile as jest.Mock).mockResolvedValue({ email: 'test@test.com' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login', async () => {
    await service.login('etsgw');

    expect(etsgwKeycloak.login).toHaveBeenCalledTimes(1);
    expect(etsgwKeycloak.login).toHaveBeenCalledWith({});
  });

  it('should logout', async () => {
    await service.logout();
    expect(etsgwKeycloak.logout).toHaveBeenCalled();
  });

  it('should update all user info when checkUser is called', async () => {
    etsgwKeycloak.authenticated = false;

    await expect(firstValueFrom(service.checkUser())).resolves.toBeUndefined();

    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectIsLoggedIn))),
    ).resolves.toBeFalsy();
    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectUser))),
    ).resolves.toBeNull();
    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectUserProfile))),
    ).resolves.toBeNull();

    authStore.setIsLoggedIn(null);
    etsgwKeycloak.authenticated = true;

    await expect(firstValueFrom(service.checkUser())).resolves.toBeUndefined();

    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectIsLoggedIn))),
    ).resolves.toBeTruthy();

    await expect(
      firstValueFrom(TestBed.runInInjectionContext(() => authStore.rxSelect(selectUserProfile))),
    ).resolves.toEqual({ email: 'test@test.com' });
  });
});
