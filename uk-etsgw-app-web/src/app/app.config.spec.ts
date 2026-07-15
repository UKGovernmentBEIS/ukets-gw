import { of } from 'rxjs';

import { ConfigService } from '@etsgw/core/config/config.service';
import { AuthService } from '@etsgw/core/services/auth.service';
import Keycloak from 'keycloak-js';

import { initApp } from './app.config';

describe('initApp', () => {
  const configService = {
    initConfigState: jest.fn(() => of({ keycloakServerUrl: 'https://keycloak.example' })),
  } as unknown as jest.Mocked<ConfigService>;
  const authService = {
    checkUser: jest.fn(() => of(undefined)),
  } as unknown as jest.Mocked<AuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes ETSGW before the downstream clients consume callback state', async () => {
    let resolveEtsgwInit: (authenticated: boolean) => void;
    const etsgwInit = new Promise<boolean>((resolve) => {
      resolveEtsgwInit = resolve;
    });
    const etsgwKeycloak = createKeycloakMock(() => etsgwInit);
    const pmrvKeycloak = createKeycloakMock();
    const mrtmKeycloak = createKeycloakMock();

    const initialization = initApp(configService, authService, etsgwKeycloak, pmrvKeycloak, mrtmKeycloak)();
    await flushPromises();

    expect(etsgwKeycloak.init).toHaveBeenCalledWith(
      expect.objectContaining({
        onLoad: 'check-sso',
        adapter: expect.objectContaining({ login: expect.any(Function) }),
      }),
    );
    expect(pmrvKeycloak.init).not.toHaveBeenCalled();
    expect(mrtmKeycloak.init).not.toHaveBeenCalled();

    resolveEtsgwInit!(true);
    await initialization;

    expect(pmrvKeycloak.init).toHaveBeenCalledTimes(1);
    expect(mrtmKeycloak.init).toHaveBeenCalledTimes(1);
    expect(authService.checkUser).toHaveBeenCalledTimes(1);
  });
});

function createKeycloakMock(init = () => Promise.resolve(false)): jest.Mocked<Keycloak> {
  return {
    init: jest.fn(init),
  } as unknown as jest.Mocked<Keycloak>;
}

async function flushPromises(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}
