const keycloakClientConfig = {
  etsgw: 'uk-ets-gw-web',
  pmrv: 'uk-pmrv-web-app',
  mrtm: 'uk-mrtm-web-app',
};

const appUrls = {
  pmrv: `${window.location.origin}/installation-aviation/`,
  mrtm: `${window.location.origin}/maritime/`,
};

const apiOptions = {
  baseUrl: '/api',
};

const timeoutBanner = {
  timeOffsetSeconds: 30,
};

export const environment = {
  keycloakClientConfig,
  appUrls,
  apiOptions,
  timeoutBanner,
};
