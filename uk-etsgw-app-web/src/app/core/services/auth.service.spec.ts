import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { firstValueFrom, of } from 'rxjs';

import { mockClass } from '@etsgw/common/testing';
import { KeycloakService } from 'keycloak-angular';

import { AuthService } from './auth.service';
import {
  AuthStore,
  selectIsLoggedIn,
  selectUser,
  selectUserProfile,
} from '@etsgw/core/auth';
import { ConfigStore } from '@etsgw/core/config/config.store';
import { UsersService } from '@etsgw/api';
import {
  ETSGW_AUTH_SERVICE,
  MRTM_AUTH_SERVICE,
  PMRV_AUTH_SERVICE,
} from '../../auth.config';

describe('AuthService', () => {
  let service: AuthService;
  let authStore: AuthStore;
  let configStore: ConfigStore;

  const etsgwKeycloakService = mockClass(KeycloakService);
  const pmrvKeycloakService = mockClass(KeycloakService);
  const mrtmKeycloakService = mockClass(KeycloakService);

  const user = {
    email: 'test@test.com',
    firstName: 'test',
    lastName: 'test',
    termsVersion: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: ETSGW_AUTH_SERVICE, useValue: etsgwKeycloakService },
        { provide: PMRV_AUTH_SERVICE, useValue: pmrvKeycloakService },
        { provide: MRTM_AUTH_SERVICE, useValue: mrtmKeycloakService },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    configStore = TestBed.inject(ConfigStore);
    configStore.setState({ features: { terms: true } });

    service = TestBed.inject(AuthService);
    etsgwKeycloakService.loadUserProfile.mockResolvedValue({
      email: 'test@test.com',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login', async () => {
    await service.login('etsgw');

    expect(etsgwKeycloakService.login).toHaveBeenCalledTimes(1);
    expect(etsgwKeycloakService.login).toHaveBeenCalledWith({});
  });

  it('should logout', async () => {
    await service.logout();
    expect(etsgwKeycloakService.logout).toHaveBeenCalled();
  });

  it('should update all user info when checkUser is called', async () => {
    etsgwKeycloakService.isLoggedIn.mockReturnValueOnce(false);

    await expect(firstValueFrom(service.checkUser())).resolves.toBeUndefined();

    await expect(
      firstValueFrom(
        TestBed.runInInjectionContext(() =>
          authStore.rxSelect(selectIsLoggedIn)
        )
      )
    ).resolves.toBeFalsy();
    await expect(
      firstValueFrom(
        TestBed.runInInjectionContext(() => authStore.rxSelect(selectUser))
      )
    ).resolves.toBeNull();
    await expect(
      firstValueFrom(
        TestBed.runInInjectionContext(() =>
          authStore.rxSelect(selectUserProfile)
        )
      )
    ).resolves.toBeNull();

    authStore.setIsLoggedIn(null);
    etsgwKeycloakService.isLoggedIn.mockReturnValueOnce(true);

    await expect(firstValueFrom(service.checkUser())).resolves.toBeUndefined();

    await expect(
      firstValueFrom(
        TestBed.runInInjectionContext(() =>
          authStore.rxSelect(selectIsLoggedIn)
        )
      )
    ).resolves.toBeTruthy();

    await expect(
      firstValueFrom(
        TestBed.runInInjectionContext(() =>
          authStore.rxSelect(selectUserProfile)
        )
      )
    ).resolves.toEqual({ email: 'test@test.com' });
  });
});
