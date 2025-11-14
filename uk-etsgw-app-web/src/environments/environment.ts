const keycloakClientConfig = {
  etsgw: 'uk-ets-gw-web',
  pmrv: 'uk-pmrv-web-app',
  mrtm: 'uk-mrtm-web-app',
};

const appUrls = {
  pmrv: 'http://localhost:4200/installation-aviation/',
  mrtm: 'http://localhost:4203/maritime/',
};

const apiOptions = {
  baseUrl: '//localhost:8078/api',
};

const timeoutBanner = {
  timeOffsetSeconds: 120,
};

export const environment = {
  keycloakClientConfig,
  appUrls,
  apiOptions,
  timeoutBanner,
};
