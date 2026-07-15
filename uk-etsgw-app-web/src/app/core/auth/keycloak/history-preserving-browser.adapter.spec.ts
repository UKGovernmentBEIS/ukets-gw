import Keycloak from 'keycloak-js';

import { createHistoryPreservingBrowserAdapter } from './history-preserving-browser.adapter';

describe('createHistoryPreservingBrowserAdapter', () => {
  const navigate = jest.fn();
  const keycloak = {
    createLoginUrl: jest.fn().mockResolvedValue('https://keycloak.example/login'),
    createLogoutUrl: jest.fn().mockReturnValue('https://keycloak.example/logout'),
    createRegisterUrl: jest.fn().mockResolvedValue('https://keycloak.example/register'),
    createAccountUrl: jest.fn().mockReturnValue('https://keycloak.example/account'),
    redirectUri: 'https://gateway.example/default-redirect',
    logoutMethod: 'GET',
    idToken: 'id-token',
    clientId: 'gateway-client',
  } as unknown as jest.Mocked<Keycloak>;

  beforeEach(() => {
    jest.clearAllMocks();
    keycloak.redirectUri = 'https://gateway.example/default-redirect';
    (keycloak as Keycloak & { logoutMethod: 'GET' | 'POST' }).logoutMethod = 'GET';
    keycloak.idToken = 'id-token';
    keycloak.clientId = 'gateway-client';
    document.body.innerHTML = '';
  });

  it('replaces the current history entry for a prompt-none SSO check', async () => {
    const adapter = createHistoryPreservingBrowserAdapter(keycloak, navigate);

    void adapter.login({ prompt: 'none' });
    await flushPromises();

    expect(navigate).toHaveBeenCalledWith('https://keycloak.example/login', 'replace');
  });

  it('retains normal navigation for an interactive login', async () => {
    const adapter = createHistoryPreservingBrowserAdapter(keycloak, navigate);

    void adapter.login();
    await flushPromises();

    expect(navigate).toHaveBeenCalledWith('https://keycloak.example/login', 'assign');
  });

  it('retains normal navigation for registration and account management', async () => {
    const adapter = createHistoryPreservingBrowserAdapter(keycloak, navigate);

    void adapter.register();
    await flushPromises();
    void adapter.accountManagement();
    await flushPromises();

    expect(navigate).toHaveBeenNthCalledWith(1, 'https://keycloak.example/register', 'assign');
    expect(navigate).toHaveBeenNthCalledWith(2, 'https://keycloak.example/account', 'href');
  });

  it('rejects account management when the OIDC server does not support it', async () => {
    keycloak.createAccountUrl.mockReturnValueOnce(undefined as never);
    const adapter = createHistoryPreservingBrowserAdapter(keycloak, navigate);

    await expect(adapter.accountManagement()).rejects.toThrow('Not supported by the OIDC server');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('replaces the current history entry for GET logout', async () => {
    (keycloak as Keycloak & { logoutMethod: 'GET' | 'POST' }).logoutMethod = 'POST';
    const adapter = createHistoryPreservingBrowserAdapter(keycloak, navigate);

    await adapter.logout({ redirectUri: 'https://gateway.example/timed-out', logoutMethod: 'GET' });

    expect(keycloak.createLogoutUrl).toHaveBeenCalledWith({
      redirectUri: 'https://gateway.example/timed-out',
      logoutMethod: 'GET',
    });
    expect(navigate).toHaveBeenCalledWith('https://keycloak.example/logout', 'replace');
  });

  it('uses the Keycloak client logout method when no per-call method is supplied', async () => {
    (keycloak as Keycloak & { logoutMethod: 'GET' | 'POST' }).logoutMethod = 'POST';
    const submit = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation();
    const adapter = createHistoryPreservingBrowserAdapter(keycloak, navigate);

    await adapter.logout({ redirectUri: 'https://gateway.example/timed-out' });

    const form = document.body.querySelector('form');
    expect(form?.getAttribute('method')).toBe('POST');
    expect(form?.getAttribute('action')).toBe('https://keycloak.example/logout');
    expect(form?.style.display).toBe('none');
    expect(form?.querySelector<HTMLInputElement>('input[name="id_token_hint"]')?.value).toBe('id-token');
    expect(form?.querySelector<HTMLInputElement>('input[name="client_id"]')?.value).toBe('gateway-client');
    expect(form?.querySelector<HTMLInputElement>('input[name="post_logout_redirect_uri"]')?.value).toBe(
      'https://gateway.example/timed-out',
    );
    expect(submit).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();

    submit.mockRestore();
  });

  it('honours a per-call POST logout method', async () => {
    const submit = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation();
    const adapter = createHistoryPreservingBrowserAdapter(keycloak, navigate);

    await adapter.logout({ logoutMethod: 'POST' });

    expect(document.body.querySelector('form')).not.toBeNull();
    expect(submit).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();

    submit.mockRestore();
  });

  it('uses the requested, configured, and current redirect URIs in precedence order', () => {
    const adapter = createHistoryPreservingBrowserAdapter(keycloak, navigate);

    expect(adapter.redirectUri({ redirectUri: 'https://gateway.example/requested' })).toBe(
      'https://gateway.example/requested',
    );
    expect(adapter.redirectUri()).toBe('https://gateway.example/default-redirect');

    keycloak.redirectUri = undefined;
    expect(adapter.redirectUri()).toBe(window.location.href);
  });
});

async function flushPromises(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}
