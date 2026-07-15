import Keycloak, { KeycloakAdapter, KeycloakLogoutOptions, KeycloakRedirectUriOptions } from 'keycloak-js';

type NavigationMethod = 'assign' | 'href' | 'replace';
type Navigate = (url: string, method: NavigationMethod) => void;
type BrowserKeycloak = Keycloak & {
  logoutMethod: NonNullable<KeycloakLogoutOptions['logoutMethod']>;
};

const navigate: Navigate = (url, method) => {
  switch (method) {
    case 'replace':
      window.location.replace(url);
      break;
    case 'href':
      window.location.href = url;
      break;
    default:
      window.location.assign(url);
  }
};

const pendingNavigation = () => new Promise<void>(() => undefined);

export function createHistoryPreservingBrowserAdapter(
  keycloak: Keycloak,
  navigateTo: Navigate = navigate,
  documentRef: Document = document,
): KeycloakAdapter {
  const browserKeycloak = keycloak as BrowserKeycloak;
  const redirectUri = (options?: KeycloakRedirectUriOptions) =>
    options?.redirectUri || keycloak.redirectUri || globalThis.location.href;

  return {
    login: async (options) => {
      const loginUrl = await keycloak.createLoginUrl(options);

      navigateTo(loginUrl, options?.prompt === 'none' ? 'replace' : 'assign');
      return pendingNavigation();
    },
    logout: async (options) => {
      const logoutMethod = options?.logoutMethod ?? browserKeycloak.logoutMethod;

      if (logoutMethod === 'GET') {
        navigateTo(keycloak.createLogoutUrl(options), 'replace');
        return;
      }

      submitLogoutForm(keycloak, redirectUri(options), options, documentRef);
    },
    register: async (options) => {
      navigateTo(await keycloak.createRegisterUrl(options), 'assign');
      return pendingNavigation();
    },
    accountManagement: async () => {
      const accountUrl = keycloak.createAccountUrl();

      if (typeof accountUrl !== 'undefined') {
        navigateTo(accountUrl, 'href');
      } else {
        throw new Error('Not supported by the OIDC server');
      }

      return pendingNavigation();
    },
    redirectUri,
  };
}

function submitLogoutForm(
  keycloak: Keycloak,
  redirectUri: string,
  options: KeycloakLogoutOptions | undefined,
  documentRef: Document,
): void {
  const form = documentRef.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', keycloak.createLogoutUrl(options));
  form.style.display = 'none';

  const data = {
    id_token_hint: keycloak.idToken,
    client_id: keycloak.clientId,
    post_logout_redirect_uri: redirectUri,
  };

  for (const [name, value] of Object.entries(data)) {
    const input = documentRef.createElement('input');

    input.setAttribute('type', 'hidden');
    input.setAttribute('name', name);
    input.setAttribute('value', value as string);
    form.appendChild(input);
  }

  documentRef.body.appendChild(form);
  form.submit();
}
